/** eslint-disable @typescript-eslint/no-explicit-any */
// app/components/emergency-map.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCCTVStore } from "../stores/cctv-store";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { LucideIcon } from "lucide-react";

// Fix for Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

export default function EmergencyMap() {
  const { filteredLocations, activeLocation, setActiveLocation } =
    useEmergencyStore();
  const [mapReady, setMapReady] = useState(false);

  // Center on Los Santos (adjusted for your coordinate system)
  const defaultCenter: [number, number] = [0, 0];
  const defaultZoom = 10;

  useEffect(() => {
    setMapReady(true);
  }, []);

  // Create custom div icon with Lucide icon
  const createCustomIcon = (
    locationType: LocationType,
    isActive: boolean = false,
  ) => {
    const colors = getColorsForType(locationType);
    const IconComponent = getIconForType(locationType);

    // Create a temporary div to render the icon
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <div class="flex items-center justify-center w-10 h-10 rounded-full ${colors.bg} ${colors.border} border-2 shadow-lg ${isActive ? "ring-2 " + colors.ring : ""}">
        <div class="${colors.text}">
          <!-- Icon will be rendered by React -->
        </div>
      </div>
    `;

    return L.divIcon({
      html: tempDiv.innerHTML,
      className: "custom-div-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });
  };

  if (!mapReady) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading emergency map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0 h-[500px]">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredLocations.map((location: any) => {
            // Convert your GTA coordinates to Leaflet coordinates
            // Note: You might need to adjust this conversion based on your original map
            const leafletCoords: [number, number] = [
              location.coordinates[1] / 100, // Convert Y to latitude
              location.coordinates[0] / 100, // Convert X to longitude
            ];

            const isSelected = activeLocation?.id === location.id;
            const colors = getColorsForType(location.type);
            const Icon = getIconForType(location.type);

            return (
              <Marker
                key={location.id}
                position={leafletCoords}
                icon={createCustomIcon(location.type, isSelected)}
                eventHandlers={{
                  click: () => setActiveLocation(location),
                }}
              >
                <Popup className="custom-popup" minWidth={250}>
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 ${colors.bg} rounded-lg`}>
                        <Icon className={`${colors.text} w-5 h-5`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{location.name}</h3>
                        <Badge
                          variant="outline"
                          className={`mt-1 ${colors.text} ${colors.border}`}
                        >
                          {location.type.toUpperCase()}
                        </Badge>
                        <div className="mt-3 space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Coordinates: </span>
                            <span className="font-mono text-xs">
                              X: {location.coordinates[0].toFixed(1)}, Y:{" "}
                              {location.coordinates[1].toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600">
                            {location.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <div
                              className={`w-3 h-3 rounded-full ${colors.bg} ${colors.border} border`}
                            ></div>
                            <span>Click to select</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
