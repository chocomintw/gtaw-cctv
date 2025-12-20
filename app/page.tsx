// app/page.tsx (updated)
"use client";

import { useEffect } from "react";
import { useCCTVStore } from "@/stores/cctv-store";
import {
  sampleOriginalData,
  convertOriginalData,
} from "@/lib/convert-locations";
import CCTVHeader from "@/components/cctv-header";
import CCTVList from "@/components/cctv-list";
import CCTVDetails from "@/components/cctv-details";
import CCTVMap from "@/components/cctv-map";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, Settings } from "lucide-react";

export default function HomePage() {
  const { loadLocations, loadFromOriginalData } = useCCTVStore();

  useEffect(() => {
    // Load from sample data (replace with your actual data)
    const locations = convertOriginalData(sampleOriginalData);
    loadLocations(locations);
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
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Settings size={16} />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CCTVMap />
                </div>
                <div className="lg:col-span-1">
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

            <TabsContent value="details">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Import Original Data
                </h2>
                <p className="text-neutral-600 mb-6">
                  To load your actual CCTV data from the original project:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mb-6">
                  <li>
                    Copy the contents of your original <code>locations.js</code>{" "}
                    file
                  </li>
                  <li>
                    Paste it into <code>app/lib/original-data.ts</code>
                  </li>
                  <li>
                    Update the import in <code>app/page.tsx</code>
                  </li>
                  <li>Restart the development server</li>
                </ol>
                <button
                  onClick={loadFromOriginalData}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Load Sample Data
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
