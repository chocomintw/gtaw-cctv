// app/components/cctv-details.tsx
"use client";

import { CCTVLocation } from "@/stores/cctv-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Compass, Eye, Shield } from "lucide-react";

interface CCTVDetailsProps {
  location: CCTVLocation;
}

export default function CCTVDetails({ location }: CCTVDetailsProps) {
  // Extract coordinates from the array
  const [x, y] = location.coordinates;
  // Use optional chaining and default values for optional properties
  const z = location.z || 0;
  const rotation = location.rotation || 0;
  
  // Determine badge color based on location type
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'gas': return 'bg-orange-100 text-orange-800';
      case 'bank': return 'bg-green-100 text-green-800';
      case 'clothing': return 'bg-purple-100 text-purple-800';
      case 'ammunation': return 'bg-red-100 text-red-800';
      case 'phone': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="text-indigo-600" size={20} />
          Camera Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Info */}
        <div>
          <h3 className="text-lg font-semibold">{location.name}</h3>
          {location.description && (
            <p className="text-sm text-neutral-600 mt-1">{location.description}</p>
          )}
        </div>

        {/* Status and Type */}
        <div className="flex items-center gap-3">
          <Badge variant={location.enabled ? "default" : "secondary"}>
            {location.enabled ? "Active" : "Inactive"}
          </Badge>
          <Badge className={getTypeColor(location.type)}>
            {location.type.toUpperCase()}
          </Badge>
        </div>

        {/* Coordinates */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-neutral-500" />
            <span className="font-medium">Coordinates:</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-500">X Position</p>
              <p className="font-mono">{x.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Y Position</p>
              <p className="font-mono">{y.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Z Position</p>
              <p className="font-mono">{z.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Rotation</p>
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-neutral-500" />
                <p className="font-mono">{rotation}°</p>
              </div>
            </div>
          </div>
        </div>

        {/* Camera ID */}
        <div className="pt-3 border-t">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-neutral-500" />
            <span className="text-sm text-neutral-500">Camera ID:</span>
            <code className="ml-2 px-2 py-1 bg-neutral-100 rounded text-sm font-mono">
              {location.id}
            </code>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Quick Actions</h4>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition">
              View Feed
            </button>
            <button className="px-3 py-1 text-sm bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition">
              Copy Coordinates
            </button>
            <button className={`px-3 py-1 text-sm rounded transition ${
              location.enabled 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}>
              {location.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}