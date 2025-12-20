// app/components/cctv-details.tsx
"use client";

import { useCCTVStore } from "../stores/cctv-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Compass, Eye, ToggleLeft } from "lucide-react";

export default function CCTVDetails() {
  const { activeLocation } = useCCTVStore();

  if (!activeLocation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Camera Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 text-center py-8">
            Select a CCTV camera to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye size={20} />
          {activeLocation.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <MapPin size={16} />
            Coordinates
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-neutral-100 rounded text-center">
              <div className="text-xs text-neutral-500">X</div>
              <div className="font-mono">{activeLocation.x.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-neutral-100 rounded text-center">
              <div className="text-xs text-neutral-500">Y</div>
              <div className="font-mono">{activeLocation.y.toFixed(2)}</div>
            </div>
            <div className="p-3 bg-neutral-100 rounded text-center">
              <div className="text-xs text-neutral-500">Z</div>
              <div className="font-mono">
                {activeLocation.z?.toFixed(2) || "0.00"}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Compass size={16} />
            Rotation
          </div>
          <div className="p-3 bg-neutral-100 rounded font-mono text-center">
            {activeLocation.rotation}°
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <ToggleLeft size={16} />
            Status
          </div>
          <div
            className={`p-3 rounded text-center font-medium ${
              activeLocation.enabled
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {activeLocation.enabled ? "Active" : "Disabled"}
          </div>
        </div>

        {activeLocation.description && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-neutral-600">{activeLocation.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
