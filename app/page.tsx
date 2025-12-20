// app/page.tsx - Fixed imports
"use client";

import { useEffect } from "react";
import { useCCTVStore } from "@/stores/cctv-store";
import { emergencyLocations } from "./data/locations";
import CCTVHeader from "@/components/cctv-header";
import CCTVList from "@/components/location-list"; // Using your location-list component
import CCTVDetails from "@/components/cctv-details";
import CCTVMap from "@/components/cctv-map"; // Using the fixed cctv-map
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, Settings } from "lucide-react";

export default function HomePage() {
  const { loadLocations } = useCCTVStore();
  
  useEffect(() => {
    // Load the emergency locations data
    loadLocations(emergencyLocations);
  }, [loadLocations]);
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <CCTVHeader />
        
        <div className="mt-6">
          <Tabs defaultValue="map" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map size={16} />
                Map View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List size={16} />
                List View
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CCTVMap />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <CCTVDetails />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CCTVList />
                </div>
                <div className="lg:col-span-1">
                  <CCTVDetails />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">Application Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Data Information</h3>
                    <p className="text-neutral-600">
                      This application displays {emergencyLocations.length} emergency service locations across San Andreas.
                    </p>
                    <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                      <h4 className="font-medium mb-2">Location Types:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          Police Stations & Government Buildings
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-600"></div>
                          Fire Stations
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                          Hospitals & Medical Centers
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                          Lifeguard Stations
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-neutral-600">
                      This is a Next.js rewrite of the original GTAW-CCTVs project, featuring:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-neutral-600">
                      <li>Next.js 15 with App Router</li>
                      <li>shadcn/ui v2 with Nova design system</li>
                      <li>Leaflet maps with marker clustering</li>
                      <li>Zustand for state management</li>
                      <li>Lucide React icons</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}