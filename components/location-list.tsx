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
        <CardTitle className="text-xl">Emergency Locations</CardTitle>
        <CardDescription>
          {filteredLocations.length} locations found
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredLocations.map((location) => {
          const colors = getColorsForType(location.type);
          const Icon = getIconForType(location.type);
          const isSelected = activeLocation?.id === location.id;

          return (
            <div
              key={location.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? `ring-2 ${colors.ring} ${colors.bg} border-${colors.border.split("-")[1]}-300`
                  : colors.border
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
