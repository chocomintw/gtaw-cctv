"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/leaflet.css";
import { useEmergencyStore } from "../stores/emergency-store"; // Changed to emergency store
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Building,
  Lock,
  Truck,
  FlameKindling,
  Stethoscope,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getIconForType, getColorsForType } from "@/app/data/locations";

// Fix for Leaflet icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

// Custom emergency marker icon
const createEmergencyIcon = (
  type: string,
  isActive: boolean,
  isSelected: boolean,
) => {
  const colors = getColorsForType(type as any);

  return L.divIcon({
    html: `
      <div class="custom-marker ${isSelected ? "active" : ""}"
           style="background-color: ${colors.bg.split(" ")[0].replace("bg-", "")};
                  border-color: ${colors.border.split(" ")[0].replace("border-", "")};">
        <div style="color: ${colors.text.split(" ")[0].replace("text-", "")};">
          ${type.charAt(0).toUpperCase()}
        </div>
      </div>
    `,
    className: "custom-div-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// GTA San Andreas map bounds (approximate)
const GTABounds = {
  min: [-4000, -4000],
  max: [4000, 4000],
};

// Default viewport (Los Santos area)
const defaultCenter: [number, number] = [0, 0];
const defaultZoom = 11;

export default function CCTVMap() {
  const { locations, activeLocation, setActiveLocation } = useEmergencyStore(); // Changed store
  const [mapReady, setMapReady] = useState(false);

  // Filter active cameras
  const activeCameras = useMemo(
    () => locations.filter((loc) => loc.enabled),
    [locations],
  );

  // GTA coordinates conversion - adjusted for emergency locations
  const convertToMapCoords = (x: number, y: number): [number, number] => {
    // Convert GTA coordinates to map coordinates
    // Your original coordinates are large numbers, so we need to scale them down
    return [y / 100, x / 100];
  };

  // Get the right Lucide icon for each location type
  const getLocationIcon = (type: string) => {
    const Icon = getIconForType(type as any);
    return Icon;
  };

  // Get color classes for location type
  const getLocationColors = (type: string) => {
    return getColorsForType(type as any);
  };

  // Load leaflet CSS dynamically
  useEffect(() => {
    setMapReady(true);
  }, []);

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
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          Emergency Services Map
          <Badge variant="outline" className="ml-2">
            {activeCameras.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          className="h-full w-full"
          maxBounds={[
            [GTABounds.min[0], GTABounds.min[1]],
            [GTABounds.max[0], GTABounds.max[1]],
          ]}
          maxBoundsViscosity={1.0}
          scrollWheelZoom={true}
          style={{ zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            maxClusterRadius={50}
          >
            {activeCameras.map((location) => {
              const coords = convertToMapCoords(
                location.coordinates[0],
                location.coordinates[1],
              );
              const isSelected = activeLocation?.id === location.id;
              const colors = getLocationColors(location.type);
              const Icon = getLocationIcon(location.type);

              return (
                <Marker
                  key={location.id}
                  position={coords}
                  icon={createEmergencyIcon(
                    location.type,
                    location.enabled,
                    isSelected,
                  )}
                  eventHandlers={{
                    click: () => setActiveLocation(location),
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Popup className="custom-popup" minWidth={250} maxWidth={250}>
                    <div className="p-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${colors.bg} rounded-lg`}>
                          <Icon className={`${colors.text} w-5 h-5`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{location.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                location.enabled ? "default" : "secondary"
                              }
                              className={`${colors.bg} ${colors.text} border-0`}
                            >
                              {location.enabled ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            <Badge variant="outline" className={colors.text}>
                              {location.type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className="text-neutral-400" />
                              <span className="font-mono">
                                X: {location.coordinates[0].toFixed(1)} | Y:{" "}
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
                      </div>
                    </div>
                  </Popup>

                  {/* Optional: Show service area circle */}
                  {location.type === "hospital" ||
                    (location.type === "fire" && (
                      <Circle
                        center={coords}
                        radius={500} // Service radius
                        pathOptions={{
                          fillColor: colors.text.replace("text-", ""),
                          color: colors.text.replace("text-", ""),
                          fillOpacity: 0.1,
                          weight: 1,
                          dashArray: "5, 5",
                        }}
                      />
                    ))}
                </Marker>
              );
            })}
          </MarkerClusterGroup>

          {/* Map Legend */}
          <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar bg-white p-3 rounded-lg shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <span className="text-sm">Police/Government</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span className="text-sm">Fire Stations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-600"></div>
                  <span className="text-sm">Hospitals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                  <span className="text-sm">Lifeguard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                  <span className="text-sm">Prisons</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <AlertCircle size={12} />
                    <span>Click markers for details</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MapContainer>
      </CardContent>
    </Card>
  );
}
