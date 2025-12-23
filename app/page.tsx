// app/page.tsx - Improved layout with larger map
"use client";

import { useEffect, useMemo, useState } from "react";
import { useCCTVStore } from "@/stores/cctv-store";
import { rawCCTVData, convertRawLocations } from "./data/locations";
import CCTVHeader from "@/components/cctv-header";
import CCTVList from "@/components/location-list";
import CCTVDetails from "@/components/cctv-details";
import CCTVMap from "@/components/cctv-map";
import LocationFilters from "@/components/location-filters";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Map,
  List,
  Grid,
  Filter,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function HomePage() {
  const { loadLocations, activeLocation } = useCCTVStore();
  const [viewMode, setViewMode] = useState<"map" | "list" | "both">("both");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cctvLocations = useMemo(() => convertRawLocations(rawCCTVData), []);

  useEffect(() => {
    loadLocations(cctvLocations);
  }, [loadLocations, cctvLocations]);

  // Toggle fullscreen for map
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 p-4 md:p-8">
      <div className="max-w-480 mx-auto">
        {" "}
        {/* Increased max width */}
        <CCTVHeader />
        {/* View Mode Toggle */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "map"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-neutral-700 border hover:bg-neutral-50"
              }`}
            >
              <Map size={16} />
              Map Only
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-neutral-700 border hover:bg-neutral-50"
              }`}
            >
              <List size={16} />
              List Only
            </button>
            <button
              onClick={() => setViewMode("both")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                viewMode === "both"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-neutral-700 border hover:bg-neutral-50"
              }`}
            >
              <Grid size={16} />
              Both
            </button>
          </div>

          {/* Fullscreen toggle for map */}
          {viewMode !== "list" && (
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 size={16} />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 size={16} />
                  Fullscreen Map
                </>
              )}
            </button>
          )}
        </div>
        {/* Main Content - Dynamic layout based on fullscreen */}
        {isFullscreen ? (
          // Fullscreen map view
          <div className="mt-6 relative">
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-white/90 backdrop-blur-sm border rounded-lg flex items-center gap-2 text-neutral-700 hover:bg-white transition-colors shadow-lg"
              >
                <Minimize2 size={16} />
                Exit Fullscreen
              </button>
            </div>
            <CCTVMap />
          </div>
        ) : (
          // Normal layout
          <div
            className={`mt-6 grid ${viewMode === "both" ? "grid-cols-1 lg:grid-cols-4" : "grid-cols-1 lg:grid-cols-3"} gap-6`}
          >
            {/* Filters Sidebar - Hidden in map-only mode */}
            {viewMode !== "map" && (
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <LocationFilters />

                  {/* Stats card */}
                  <Card className="mt-6">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Filter size={16} className="text-neutral-400" />
                          <span className="text-sm font-medium">
                            Quick Stats
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                              Total Cameras
                            </span>
                            <span className="font-semibold">
                              {cctvLocations.length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                              Active
                            </span>
                            <span className="font-semibold text-green-600">
                              {
                                cctvLocations.filter((loc) => loc.enabled)
                                  .length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">
                              Inactive
                            </span>
                            <span className="font-semibold text-neutral-500">
                              {
                                cctvLocations.filter((loc) => !loc.enabled)
                                  .length
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div
              className={`${viewMode === "both" ? "lg:col-span-3" : "lg:col-span-3"} space-y-6`}
            >
              {/* Map Section - Larger height */}
              {viewMode !== "list" && (
                <div
                  className={`${viewMode === "map" ? "h-[calc(100vh-200px)]" : "h-150"}`}
                >
                  <CCTVMap />
                </div>
              )}

              {/* List Section */}
              {viewMode !== "map" && (
                <div
                  className={viewMode === "list" ? "h-[calc(100vh-200px)]" : ""}
                >
                  <CCTVList />
                </div>
              )}

              {/* Details Panel - Only show if not in map-only fullscreen */}
              {viewMode !== "map" && (
                <div>
                  {activeLocation ? (
                    <CCTVDetails location={activeLocation} />
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center text-center p-8">
                          <AlertCircle className="h-12 w-12 text-neutral-300 mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            No Camera Selected
                          </h3>
                          <p className="text-neutral-500 text-sm">
                            Select a camera from the map or list to view its
                            details.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Quick actions footer */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-600">
            <div>
              <span className="font-medium">GTA World CCTV System</span>
              <span className="mx-2">•</span>
              <span>{cctvLocations.length} camera locations</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Back to top
              </button>
              <button
                onClick={() => {
                  const element = document.querySelector(".leaflet-container");
                  if (element) {
                    (element as HTMLElement).click();
                  }
                }}
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Focus on map
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
