/** eslint-disable @typescript-eslint/no-explicit-any */
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
    loading: () => <div className="h-125 bg-neutral-100 animate-pulse" />,
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
  },

  attribution: "made by monster, george?, paz & chocomint",

  initialView: [-1192.7, -135.1] as [number, number],
  initialZoom: 3,
  minZoom: 3,
  maxZoom: 5,
  maxNativeZoom: 5,
};

const getColorForType = (type: LocationType) => {
  switch (type) {
    case "gas":
      return {
        text: "text-orange-600 dark:text-orange-400",
        border: "border-orange-300 dark:border-orange-800",
        bg: "bg-orange-100 dark:bg-orange-900/30",
      };
    case "bank":
      return {
        text: "text-green-600 dark:text-green-400",
        border: "border-green-300 dark:border-green-800",
        bg: "bg-green-100 dark:bg-green-900/30",
      };
    case "clothing":
      return {
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-300 dark:border-purple-800",
        bg: "bg-purple-100 dark:bg-purple-900/30",
      };
    case "ammunation":
      return {
        text: "text-red-600 dark:text-red-400",
        border: "border-red-300 dark:border-red-800",
        bg: "bg-red-100 dark:bg-red-900/30",
      };
    case "phone":
      return {
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-300 dark:border-blue-800",
        bg: "bg-blue-100 dark:bg-blue-900/30",
      };
    default:
      return {
        text: "text-gray-600 dark:text-zinc-400",
        border: "border-gray-300 dark:border-zinc-700",
        bg: "bg-gray-100 dark:bg-zinc-800",
      };
  }
};

export default function CCTVMap() {
  const {
    filteredLocations,
    setActiveLocation,
    targetCoordinates,
    setTargetCoordinates,
  } = useCCTVStore();
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leafletLoaded, setLeafletLoaded] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customCRS, setCustomCRS] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<
    "satellite" | "atlas" | "grid"
  >("satellite");
  const [mapReady, setMapReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customIcon, setCustomIcon] = useState<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [searchMarkerCoords, setSearchMarkerCoords] = useState<
    [number, number] | null
  >(null);

  const activeLocations = useMemo(
    () => filteredLocations.filter((loc) => loc.enabled),
    [filteredLocations],
  );

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

  // Add custom CSS for icons and dark theme
  useEffect(() => {
    // Add custom CSS for the CCTV icon and dark theme popups
    const style = document.createElement("style");
    style.textContent = `
      .cctv-marker-icon {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }
      .cctv-marker-icon:hover {
        filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.5)) brightness(1.1);
      }

      /* Dark theme for Leaflet popups */
      .leaflet-popup-content-wrapper {
        background-color: white;
        color: #1f2937;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .dark .leaflet-popup-content-wrapper {
        background-color: #18181b;
        color: #f4f4f5;
        border: 1px solid #3f3f46;
      }

      .leaflet-popup-tip {
        background-color: white;
      }

      .dark .leaflet-popup-tip {
        background-color: #18181b;
      }

      /* Search marker specific styles */
      .search-marker-popup .leaflet-popup-content-wrapper {
        background-color: #f0f9ff;
        border: 2px solid #0ea5e9;
      }

      .dark .search-marker-popup .leaflet-popup-content-wrapper {
        background-color: #0c4a6e;
        border: 2px solid #38bdf8;
        color: #e0f2fe;
      }

      /* Layer control dark theme */
      .leaflet-control {
        background-color: rgba(255, 255, 255, 0.95);
      }

      .dark .leaflet-control {
        background-color: rgba(24, 24, 27, 0.95);
        color: #f4f4f5;
      }

      .leaflet-bar {
        background-color: rgba(255, 255, 255, 0.95);
      }

      .dark .leaflet-bar {
        background-color: rgba(24, 24, 27, 0.95);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle search coordinates
  useEffect(() => {
    if (!targetCoordinates || !mapRef.current || !mapReady) return;

    // targetCoordinates comes in [y, x] format from search
    // We need to convert to our internal [x, y] format
    const [inputY, inputX] = targetCoordinates;

    console.log("=== SEARCH START ===");
    console.log("Input coords (Y,X format):", { inputY, inputX });

    // Convert to internal [x, y] format
    const internalCoords: [number, number] = [inputX, inputY];
    console.log("Internal coords (X,Y format):", internalCoords);

    // VALIDATION
    if (isNaN(inputX) || isNaN(inputY)) {
      console.error("Invalid coordinates - not numbers");
      setTargetCoordinates(null);
      return;
    }

    // Store in internal format [x, y]
    setSearchMarkerCoords(internalCoords);

    // Use setTimeout to ensure marker is rendered before flying
    setTimeout(() => {
      if (mapRef.current) {
        console.log("Flying to internal coords:", internalCoords);
        try {
          mapRef.current.flyTo(internalCoords, 4, {
            duration: 1.5,
            easeLinearity: 0.25,
          });
        } catch (error) {
          console.error("FlyTo failed, using setView:", error);
          mapRef.current.setView(internalCoords, 4);
        }
      }
    }, 100);

    // Clear search after delay
    const clearSearchTimer = setTimeout(() => {
      setTargetCoordinates(null);
    }, 1600);

    // Remove marker after delay
    const clearMarkerTimer = setTimeout(() => {
      setSearchMarkerCoords(null);
    }, 10000);

    return () => {
      clearTimeout(clearSearchTimer);
      clearTimeout(clearMarkerTimer);
    };
  }, [targetCoordinates, mapReady, setTargetCoordinates]);

  // Debug: Log coordinate formats
  useEffect(() => {
    if (activeLocations.length > 0) {
      // Find locations with negative coordinates
      const negativeLocations = activeLocations.filter(
        (loc) => loc.coordinates[0] < 0 || loc.coordinates[1] < 0,
      );

      if (negativeLocations.length > 0) {
        console.log("Found CCTV locations with negative coordinates:");
        negativeLocations.forEach((loc) => {
          console.log(
            `- ${loc.name}: [${loc.coordinates[0]}, ${loc.coordinates[1]}]`,
          );
        });
      }

      // Show first few locations for reference
      console.log("First few CCTV locations (internal [X,Y] format):");
      activeLocations.slice(0, 3).forEach((loc) => {
        console.log(
          `- ${loc.name}: X=${loc.coordinates[0].toFixed(1)}, Y=${loc.coordinates[1].toFixed(1)}`,
        );
      });
    }
  }, [activeLocations]);

  const getActiveTileUrl = useCallback(() => {
    switch (activeLayer) {
      case "satellite":
        return GTAW_CONFIG.tileUrls.satellite;
      case "atlas":
        return GTAW_CONFIG.tileUrls.atlas;
      case "grid":
        return GTAW_CONFIG.tileUrls.grid;
      default:
        return GTAW_CONFIG.tileUrls.satellite;
    }
  }, [activeLayer]);

  const mapCRS = useMemo(() => customCRS || (leafletLoaded ? leafletLoaded.CRS.Simple : null), [customCRS, leafletLoaded]);

  // Memoize search marker
  const searchMarker = useMemo(() => {
    if (!searchMarkerCoords || !leafletLoaded) return null;
    return (
      <Marker
        position={searchMarkerCoords}
        icon={leafletLoaded.icon({
          iconUrl: "/leaflet/images/marker-icon.png",
          iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
          shadowUrl: "/leaflet/images/marker-shadow.png",
          iconSize: [24, 40],
          iconAnchor: [12, 40],
          popupAnchor: [0, -40],
          className: "search-marker-icon",
        })}
        zIndexOffset={1000}
      >
        <Popup className="search-marker-popup">
          <div className="p-3 min-w-56">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-300/30 rounded-lg">
                <MapPin
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  🔍 Search Location
                </h3>
                <Badge
                  variant="outline"
                  className="mt-1 text-xs border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400"
                >
                  SEARCH RESULT
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  GTA Coordinates:
                </div>
                <div className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded border border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      X:
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {searchMarkerCoords[0].toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Y:
                    </span>
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {searchMarkerCoords[1].toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <AlertCircle size={10} />
                  <span>Marker will disappear in 10 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }, [searchMarkerCoords, leafletLoaded]);

  // Memoize CCTV markers
  const cctvMarkers = useMemo(() => {
    if (!customIcon) return null;
    return activeLocations.map((location: CCTVLocation) => {
      const coords: [number, number] = [
        location.coordinates[0],
        location.coordinates[1],
      ];
      const colors = getColorForType(location.type);

      return (
        <Marker
          key={location.id}
          position={coords}
          icon={customIcon}
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
          <Popup className="cctv-popup">
            <div className="p-3 min-w-62.5">
              <div className="flex items-start gap-3">
                <div className={`p-2 ${colors.bg} rounded-lg`}>
                  <Camera className={`${colors.text}`} size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1 text-neutral-900 dark:text-neutral-100">
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
                <div className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium">
                    GTA Coordinates (X,Y):{" "}
                  </span>
                  <span className="font-mono text-xs">
                    {location.coordinates[0].toFixed(1)},{" "}
                    {location.coordinates[1].toFixed(1)}
                  </span>
                </div>
                {location.description && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {location.description}
                  </p>
                )}
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-500">
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
    });
  }, [activeLocations, customIcon, setActiveLocation]);

  if (!isClient) {
    return (
      <Card className="h-125 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading GTA World map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Camera size={20} className="text-indigo-600" />
          GTA:World CCTV Map
          <Badge variant="outline" className="ml-2">
            {activeLocations.length} Server-owned CCTVs.
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full" ref={mapContainerRef}>
        {leafletLoaded && mapCRS && mapReady && customIcon ? (
          <div className="h-full w-full">
            <MapContainer
              center={[-1500, -1000]} // Adjusted to center more on the city
              zoom={GTAW_CONFIG.initialZoom}
              crs={mapCRS}
              className="h-full w-full"
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "transparent",
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
                <div className="leaflet-control leaflet-bar bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-3 rounded-lg shadow-lg m-4 border border-neutral-200 dark:border-zinc-800">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Layers
                        size={16}
                        className="text-neutral-600 dark:text-neutral-400"
                      />
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Map Style
                      </span>
                    </div>
                    <div className="space-y-2">
                      {(["satellite", "atlas", "grid"] as const).map(
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
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm capitalize text-neutral-700 dark:text-neutral-300">
                              {style}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Markers with custom CCTV icon */}
              {cctvMarkers}

              {/* Search location marker */}
              {searchMarker}
            </MapContainer>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-neutral-600">Loading CCTV map...</p>
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-blue-500 rounded-lg animate-pulse"></div>
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
