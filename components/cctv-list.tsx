// app/components/cctv-list.tsx
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
import { MapPin, Video } from "lucide-react";

export default function CCTVList() {
  const {
    filteredLocations,
    activeLocation,
    setActiveLocation,
    toggleLocation,
  } = useCCTVStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video size={20} />
          CCTV Cameras ({filteredLocations.length})
        </CardTitle>
        <CardDescription>Click on a camera to view details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-neutral-50 ${
              activeLocation?.id === location.id
                ? "ring-2 ring-indigo-500 bg-indigo-50"
                : ""
            }`}
            onClick={() => setActiveLocation(location)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded">
                  <MapPin className="text-indigo-600" size={18} />
                </div>
                <div>
                  <h3 className="font-medium">{location.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={location.enabled ? "default" : "secondary"}>
                      {location.enabled ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-neutral-500">
                      {location.x.toFixed(2)}, {location.y.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Switch
                checked={location.enabled}
                onCheckedChange={() => toggleLocation(location.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {location.description && (
              <p className="text-sm text-neutral-600 mt-2">
                {location.description}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
