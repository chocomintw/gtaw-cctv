/** eslint-disable @typescript-eslint/no-explicit-any */
// app/components/cctv-map.tsx - Updated with custom CCTV blips
"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useCCTVStore } from "../stores/cctv-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, AlertCircle, Layers, Camera } from "lucide-react";
import { Badge } from "./ui/badge";
import { CCTVLocation, LocationType } from "@/stores/cctv-store";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => <div className="h-[500px] bg-neutral-100 animate-pulse" />,
  },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// EXACT transformation from original GTAW map
const GTAW_CONFIG = {
  scaleX: 0.02072,
  offsetX: 117.3,
  scaleY: -0.0205,
  offsetY: 172.8,

  tileUrls: {
    atlas: "mapStyles/styleAtlas/{z}/{x}/{y}.jpg",
    satellite: "mapStyles/styleSatelite/{z}/{x}/{y}.jpg",
    grid: "mapStyles/styleGrid/{z}/{x}/{y}.png",
    street: "mapStyles/styleStreet/{z}/{x}/{y}.jpg",
  },

  attribution: "made by monster, george? & chocomint",

  initialView: [-1192.7, -135.1] as [number, number],
  initialZoom: 3,
  minZoom: 1,
  maxZoom: 5,
  maxNativeZoom: 5,
};

export default function CCTVMap() {
  const { locations, setActiveLocation } = useCCTVStore();
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leafletLoaded, setLeafletLoaded] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customCRS, setCustomCRS] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<
    "satellite" | "atlas" | "street" | "grid"
  >("satellite");
  const [mapReady, setMapReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customIcon, setCustomIcon] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  const activeLocations = useMemo(
    () => locations.filter((loc) => loc.enabled),
    [locations],
  );

  const getColorForType = (type: LocationType) => {
    switch (type) {
      case "gas":
        return {
          text: "text-orange-600",
          border: "border-orange-300",
          bg: "bg-orange-100",
        };
      case "bank":
        return {
          text: "text-green-600",
          border: "border-green-300",
          bg: "bg-green-100",
        };
      case "clothing":
        return {
          text: "text-purple-600",
          border: "border-purple-300",
          bg: "bg-purple-100",
        };
      case "ammunation":
        return {
          text: "text-red-600",
          border: "border-red-300",
          bg: "bg-red-100",
        };
      case "phone":
        return {
          text: "text-blue-600",
          border: "border-blue-300",
          bg: "bg-blue-100",
        };
      default:
        return {
          text: "text-gray-600",
          border: "border-gray-300",
          bg: "bg-gray-100",
        };
    }
  };

  // Create custom CRS
  const createCustomCRS = useCallback(() => {
    if (typeof window === "undefined" || !leafletLoaded) return null;

    const L = leafletLoaded;
    return L.extend({}, L.CRS.Simple, {
      projection: L.Projection.LonLat,
      transformation: new L.Transformation(
        GTAW_CONFIG.scaleX,
        GTAW_CONFIG.offsetX,
        GTAW_CONFIG.scaleY,
        GTAW_CONFIG.offsetY,
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      distance: function (pos1: any, pos2: any) {
        const xDiff = pos2.lng - pos1.lng;
        const yDiff = pos2.lat - pos1.lat;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      },
      scale: function (zoom: number) {
        return Math.pow(2, zoom);
      },
      zoom: function (sc: number) {
        return Math.log(sc) / 0.6931471805599453;
      },
      infinite: true,
    });
  }, [leafletLoaded]);

  // Initialize Leaflet with custom CCTV icon
  useEffect(() => {
    setIsClient(true);

    const initLeaflet = async () => {
      try {
        const L = await import("leaflet");

        // Fix for default icon URLs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
          iconUrl: "/leaflet/images/marker-icon.png",
          shadowUrl: "/leaflet/images/marker-shadow.png",
        });

        // Create custom CCTV icon
        const cctvIcon = L.icon({
          iconUrl: "/leaflet/images/cctv1.png",
          iconSize: [16, 16], // Size of the icon on the map
          iconAnchor: [8, 8], // Point of the icon which will correspond to marker's location
          popupAnchor: [0, -8], // Point from which the popup should open relative to the iconAnchor
          // shadowUrl: "/path/to/shadow.png", // Optional if you want shadow
          // shadowSize: [32, 32],
          // shadowAnchor: [16, 16],
          className: "cctv-marker-icon", // Custom CSS class for additional styling
        });

        setLeafletLoaded(L);
        setCustomIcon(cctvIcon);

        const crs = createCustomCRS();
        setCustomCRS(crs);

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          setMapReady(true);
        }, 100);
      } catch (error) {
        console.error("Failed to load Leaflet:", error);
      }
    };

    if (typeof window !== "undefined") {
      initLeaflet();
    }

    return () => {
      setMapReady(false);
    };
  }, [createCustomCRS]);

  // Force map refresh when it becomes visible
  useEffect(() => {
    if (mapReady && mapRef.current) {
      const timer = setTimeout(() => {
        if (mapRef.current) {
          try {
            mapRef.current.invalidateSize();
          } catch (error) {
            console.error("Error refreshing map:", error);
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [mapReady]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add some CSS for the custom icon
  useEffect(() => {
    // Add custom CSS for the CCTV icon
    const style = document.createElement("style");
    style.textContent = `
      .cctv-marker-icon {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
      .cctv-marker-icon:hover {
        filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.5)) brightness(1.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getActiveTileUrl = () => {
    switch (activeLayer) {
      case "satellite":
        return GTAW_CONFIG.tileUrls.satellite;
      case "atlas":
        return GTAW_CONFIG.tileUrls.atlas;
      case "street":
        return GTAW_CONFIG.tileUrls.street;
      case "grid":
        return GTAW_CONFIG.tileUrls.grid;
      default:
        return GTAW_CONFIG.tileUrls.satellite;
    }
  };

  if (!isClient) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading GTA World map...</p>
        </div>
      </Card>
    );
  }

  const mapCRS = customCRS || leafletLoaded?.CRS.Simple;

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Camera size={20} className="text-indigo-600" />
          GTA World CCTV Map
          <Badge variant="outline" className="ml-2">
            {activeLocations.length} Active
          </Badge>
          <span className="text-xs text-neutral-500 ml-2 flex items-center gap-1">
            <MapPin size={12} />
            Using custom CCTV blips
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full" ref={mapContainerRef}>
        {leafletLoaded && mapCRS && mapReady && customIcon ? (
          <div className="h-full w-full" key={`map-${mapReady}`}>
            <MapContainer
              center={GTAW_CONFIG.initialView}
              zoom={GTAW_CONFIG.initialZoom}
              crs={mapCRS}
              className="h-full w-full"
              style={{
                height: "100%",
                width: "100%",
                minHeight: "500px",
                backgroundColor: "#f0f0f0",
              }}
              minZoom={GTAW_CONFIG.minZoom}
              maxZoom={GTAW_CONFIG.maxZoom}
              preferCanvas={true}
              ref={mapRef}
              whenReady={() => {
                if (mapRef.current) {
                  setTimeout(() => {
                    mapRef.current.invalidateSize();
                  }, 50);
                }
              }}
            >
              <TileLayer
                attribution={GTAW_CONFIG.attribution}
                url={getActiveTileUrl()}
                minZoom={GTAW_CONFIG.minZoom}
                maxZoom={GTAW_CONFIG.maxZoom}
                maxNativeZoom={GTAW_CONFIG.maxNativeZoom}
                noWrap={false}
              />

              {/* Simple Layer Control */}
              <div className="leaflet-top leaflet-right">
                <div className="leaflet-control leaflet-bar bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg m-4 border">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Layers size={16} className="text-neutral-600" />
                      <span className="text-sm font-medium">Map Style</span>
                    </div>
                    <div className="space-y-2">
                      {(["satellite", "atlas", "street", "grid"] as const).map(
                        (style) => (
                          <label
                            key={style}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="mapLayer"
                              value={style}
                              checked={activeLayer === style}
                              onChange={(e) =>
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                setActiveLayer(e.target.value as any)
                              }
                              className="text-indigo-600"
                            />
                            <span className="text-sm capitalize">{style}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Markers with custom CCTV icon */}
              {activeLocations.map((location: CCTVLocation) => {
                const coords: [number, number] = [
                  location.coordinates[0],
                  location.coordinates[1],
                ];
                const colors = getColorForType(location.type);

                return (
                  <Marker
                    key={location.id}
                    position={coords}
                    icon={customIcon} // Use the custom CCTV icon
                    eventHandlers={{
                      click: () => setActiveLocation(location),
                      mouseover: (e) => {
                        e.target.openPopup();
                      },
                      mouseout: (e) => {
                        e.target.closePopup();
                      },
                    }}
                  >
                    <Popup>
                      <div className="p-3 min-w-[250px]">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 ${colors.bg} rounded-lg`}>
                            <Camera className={`${colors.text}`} size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-base mb-1">
                              {location.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`mb-2 ${colors.text} ${colors.border}`}
                            >
                              {location.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2 mt-3">
                          <div className="text-sm">
                            <span className="font-medium">
                              GTA Coordinates:{" "}
                            </span>
                            <span className="font-mono text-xs">
                              X: {location.coordinates[0].toFixed(1)}, Y:{" "}
                              {location.coordinates[1].toFixed(1)}
                            </span>
                          </div>
                          {location.description && (
                            <p className="text-sm text-neutral-600">
                              {location.description}
                            </p>
                          )}
                          <div className="pt-2 border-t text-xs text-neutral-500">
                            <div className="flex items-center gap-1">
                              <Camera size={10} />
                              CCTV Camera #{location.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Map Legend - Updated with CCTV icon */}
              <div className="leaflet-bottom leaflet-right">
                <div className="leaflet-control leaflet-bar bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg m-4 border">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src="leaflet/images/cctv1.png"
                        alt="CCTV Icon"
                        className="w-4 h-4"
                      />
                      <span className="text-sm">CCTV Cameras</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                          <span>Gas Stations</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                          <span>Banks</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                          <span>Clothing</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <div className="w-3 h-3 rounded-full bg-red-600"></div>
                          <span>Ammunation</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <span>Phone Stores</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <AlertCircle size={12} />
                        <span>Click CCTV icons for details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MapContainer>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-neutral-600">Loading CCTV map...</p>
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg animate-pulse"></div>
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Loading custom CCTV icons...
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
