// app/components/location-list.tsx
"use client";

import { useCCTVStore } from "../stores/cctv-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import {
  Fuel,
  Banknote,
  Shirt,
  Target,
  Smartphone,
  Building,
} from "lucide-react";
import type { LocationType } from "@/stores/cctv-store";
import { LucideIcon } from "lucide-react";

// Helper functions for colors and icons (same as in location-filters.tsx)
const getColorsForType = (type: LocationType) => {
  switch (type) {
    case "gas":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-300",
        ring: "ring-orange-500",
      };
    case "bank":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
        ring: "ring-green-500",
      };
    case "clothing":
      return {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-300",
        ring: "ring-purple-500",
      };
    case "ammunation":
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
        ring: "ring-red-500",
      };
    case "phone":
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-300",
        ring: "ring-blue-500",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-300",
        ring: "ring-gray-500",
      };
  }
};

const getIconForType = (type: LocationType): LucideIcon => {
  switch (type) {
    case "gas":
      return Fuel;
    case "bank":
      return Banknote;
    case "clothing":
      return Shirt;
    case "ammunation":
      return Target;
    case "phone":
      return Smartphone;
    default:
      return Building;
  }
};

export default function LocationList() {
  const {
    filteredLocations,
    activeLocation,
    setActiveLocation,
    toggleLocation,
  } = useCCTVStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">CCTV Locations</CardTitle>{" "}
        {/* Changed from "Emergency Locations" */}
        <CardDescription>
          {filteredLocations.length} locations found
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-125 overflow-y-auto">
        {filteredLocations.map((location) => {
          const colors = getColorsForType(location.type);
          const Icon = getIconForType(location.type);
          const isSelected = activeLocation?.id === location.id;

          return (
            <div
              key={location.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? `ring-2 ${colors.ring} ${colors.bg} ${colors.border}`
                  : `border ${colors.border}`
              }`}
              onClick={() => setActiveLocation(location)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={`${colors.text} w-5 h-5`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{location.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`${colors.text} ${colors.bg} border-0`}
                      >
                        {location.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-neutral-500">
                        X: {location.coordinates[0].toFixed(1)}, Y:{" "}
                        {location.coordinates[1].toFixed(1)}
                      </span>
                    </div>
                    {location.description && (
                      <p className="text-sm text-neutral-600 mt-2">
                        {location.description}
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={location.enabled}
                  onCheckedChange={() => toggleLocation(location.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="ml-2"
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
