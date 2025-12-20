// app/components/cctv-map.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/leaflet.css";
import { useCCTVStore } from "../stores/cctv-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Video, MapPin, Eye, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import MarkerClusterGroup from "react-leaflet-markercluster";

// Fix for Leaflet icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
});

// Custom CCTV marker icon
const createCCTVIcon = (isActive: boolean, isSelected: boolean) => {
  return L.divIcon({
    html: `
      <div class="custom-marker ${isSelected ? "active" : ""}"
           style="background-color: ${isActive ? "#4f46e5" : "#6b7280"};">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
          <path d="M18 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.5l4 4v-11l-4 4zm-8 5.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
        </svg>
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
  const { locations, activeLocation, setActiveLocation } = useCCTVStore();
  const [mapReady, setMapReady] = useState(false);

  // Filter active cameras
  const activeCameras = useMemo(
    () => locations.filter((loc) => loc.enabled),
    [locations],
  );

  // GTA coordinates conversion if needed
  const convertToMapCoords = (x: number, y: number): [number, number] => {
    // Adjust this based on your original project's coordinate system
    return [y / 100, x / 100]; // Simplified conversion
  };

  // Load leaflet CSS dynamically
  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady) {
    return (
      <Card className="h-125 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          CCTV Map Overview
          <Badge variant="outline" className="ml-2">
            {activeCameras.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-125">
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
          {/* Custom GTA-style tiles or use OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // For GTA style map, you might need custom tiles
            // url="/tiles/{z}/{x}/{y}.png"
          />

          {/* Marker Cluster Group */}
          <MarkerClusterGroup
            chunkedLoading
            showCoverageOnHover={false}
            spiderfyOnMaxZoom={true}
            maxClusterRadius={50}
          >
            {activeCameras.map((camera) => {
              const coords = convertToMapCoords(camera.x, camera.y);
              const isSelected = activeLocation?.id === camera.id;

              return (
                <Marker
                  key={camera.id}
                  position={coords}
                  icon={createCCTVIcon(camera.enabled, isSelected)}
                  eventHandlers={{
                    click: () => setActiveLocation(camera),
                    mouseover: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Popup className="custom-popup" minWidth={250} maxWidth={250}>
                    <div className="p-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Video className="text-indigo-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{camera.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={camera.enabled ? "default" : "secondary"}
                            >
                              {camera.enabled ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                            {camera.interior && (
                              <Badge variant="outline">Interior</Badge>
                            )}
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className="text-neutral-400" />
                              <span className="font-mono">
                                X: {camera.x.toFixed(2)} | Y:{" "}
                                {camera.y.toFixed(2)}
                              </span>
                            </div>
                            {camera.rotation && (
                              <div className="flex items-center gap-2 text-sm">
                                <Eye size={14} className="text-neutral-400" />
                                <span>Rotation: {camera.rotation}°</span>
                              </div>
                            )}
                            {camera.description && (
                              <p className="text-sm text-neutral-600 mt-2">
                                {camera.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>

                  {/* Show camera viewing area circle */}
                  {camera.rotation && (
                    <Circle
                      center={coords}
                      radius={camera.streamDistance || 100}
                      pathOptions={{
                        fillColor: "#4f46e5",
                        color: "#4f46e5",
                        fillOpacity: 0.1,
                        weight: 1,
                        dashArray: "5, 5",
                      }}
                    />
                  )}
                </Marker>
              );
            })}
          </MarkerClusterGroup>

          {/* Map Legend */}
          <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar bg-white p-3 rounded-lg shadow-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
                  <span className="text-sm">Active CCTV</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                  <span className="text-sm">Inactive CCTV</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span className="text-sm">Selected</span>
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
