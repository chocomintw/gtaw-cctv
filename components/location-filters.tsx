// app/components/location-filters.tsx
"use client";

import { useCCTVStore } from "@/stores/cctv-store";
import {
  getAllLocationTypes,
  getIconForType,
  getColorsForType,
} from "@/app/data/locations";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export default function LocationFilters() {
  const { filter, setFilter, selectedTypes, toggleLocationType, resetFilters } =
    useCCTVStore();
  const allTypes = getAllLocationTypes();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <Input
              placeholder="Search locations..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9"
            />
            {filter && (
              <button
                onClick={() => setFilter("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type filters */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span className="text-sm font-medium">Filter by type</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTypes.map((type) => {
                const Icon = getIconForType(type);
                const colors = getColorsForType(type);
                const isSelected = selectedTypes.includes(type);

                return (
                  <Button
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleLocationType(type)}
                    className={`gap-2 ${isSelected ? colors.bg + " " + colors.text : ""}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Reset filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="w-full"
          >
            Reset all filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
