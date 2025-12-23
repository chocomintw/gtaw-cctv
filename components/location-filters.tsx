// Quick alternative for location-filters.tsx
"use client";

import { useCCTVStore } from "@/stores/cctv-store";
import { Button } from "./ui/button";
import { Fuel, Banknote, Shirt, Target, Smartphone, Building } from "lucide-react";
import type { LocationType } from "@/stores/cctv-store";
import { LucideIcon } from "lucide-react";

// Define helper functions locally
const getAllLocationTypes = (): LocationType[] =>
  ['gas', 'bank', 'clothing', 'ammunation', 'phone', 'other'];

const getIconForType = (type: LocationType): LucideIcon => {
  switch (type) {
    case 'gas': return Fuel;
    case 'bank': return Banknote;
    case 'clothing': return Shirt;
    case 'ammunation': return Target;
    case 'phone': return Smartphone;
    default: return Building;
  }
};

const getColorsForType = (type: LocationType) => {
  switch (type) {
    case 'gas': return {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-400',
      border: 'border-orange-300 dark:border-orange-800'
    };
    case 'bank': return {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      border: 'border-green-300 dark:border-green-800'
    };
    case 'clothing': return {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-400',
      border: 'border-purple-300 dark:border-purple-800'
    };
    case 'ammunation': return {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-400',
      border: 'border-red-300 dark:border-red-800'
    };
    case 'phone': return {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-400',
      border: 'border-blue-300 dark:border-blue-800'
    };
    default: return {
      bg: 'bg-gray-100 dark:bg-zinc-800',
      text: 'text-gray-800 dark:text-zinc-400',
      border: 'border-gray-300 dark:border-zinc-700'
    };
  }
};

export default function LocationFilters() {
  const { selectedTypes, toggleLocationType, resetFilters } = useCCTVStore();
  const allTypes = getAllLocationTypes();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 bg-white dark:bg-zinc-900/50 p-1 rounded-xl border border-neutral-200 dark:border-zinc-800 shadow-sm">
        {allTypes.map((type) => {
          const Icon = getIconForType(type);
          const colors = getColorsForType(type);
          const isSelected = selectedTypes.includes(type);

          return (
            <button
              key={type}
              onClick={() => toggleLocationType(type)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isSelected
                  ? `${colors.bg} ${colors.text} shadow-sm ring-1 ring-inset ${colors.border}`
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-neutral-700 dark:hover:text-neutral-300"
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          );
        })}
      </div>

      {selectedTypes.length < allTypes.length && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          Reset
        </Button>
      )}
    </div>
  );
}