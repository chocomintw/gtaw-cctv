// app/components/cctv-header.tsx
"use client";

import { Search, MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCCTVStore } from "../stores/cctv-store";

export default function CCTVHeader() {
  const { filter, setFilter } = useCCTVStore();

  return (
    <header className="border-b pb-6">
      <h1 className="text-4xl font-bold text-neutral-900">
        GTA CCTV Locations
      </h1>
      <p className="text-neutral-600 mt-2">
        Monitor and manage security cameras across San Andreas
      </p>

      <div className="flex gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search CCTV locations..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="default" className="gap-2">
          <MapPin size={18} />
          View Map
        </Button>
      </div>
    </header>
  );
}
