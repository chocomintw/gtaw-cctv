// app/page.tsx - Improved layout with premium design
"use client";

import { useEffect, useMemo, useState } from "react";
import { useCCTVStore } from "@/stores/cctv-store";
import { rawCCTVData, convertRawLocations } from "./data/locations";
import CCTVHeader from "@/components/cctv-header";
import CCTVList from "@/components/location-list";
import CCTVDetails from "@/components/cctv-details";
import CCTVMap from "@/components/cctv-map";
import LocationFilters from "@/components/location-filters";
import { Camera } from "lucide-react";

export default function HomePage() {
  const { loadLocations, activeLocation } = useCCTVStore();

  const cctvLocations = useMemo(() => convertRawLocations(rawCCTVData), []);

  useEffect(() => {
    loadLocations(cctvLocations);
  }, [loadLocations, cctvLocations]);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative overflow-x-hidden">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/30 blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 md:p-8 space-y-8">
        <CCTVHeader />

        {/* Filters Bar */}
        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <LocationFilters />
        </div>

        {/* Main Content */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {/* Map Section */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-white/20 dark:border-white/5 h-[700px] xl:h-[800px]">
            <CCTVMap />
          </div>

          {/* List Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[600px]">
              <CCTVList />
            </div>

            {/* Details Panel */}
            <div>
              {activeLocation ? (
                <div className="sticky top-6">
                  <CCTVDetails location={activeLocation} />
                </div>
              ) : (
                <div className="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center h-64 sticky top-6">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
                    No Camera Selected
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs">
                    Select a camera from the map or list to view its live feed
                    details and controls.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            <p>© 2025 GTA World CCTV Lookup. All rights reserved.</p>
            <div className="flex gap-6">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Back to Top
              </button>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
