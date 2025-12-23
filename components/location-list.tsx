// app/components/location-list.tsx
"use client";

import { useCCTVStore } from "../stores/cctv-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

import {
  Fuel,
  Banknote,
  Shirt,
  Target,
  Smartphone,
  Building,
  Video,
  VideoOff,
  ChevronRight,
} from "lucide-react";
import type { LocationType } from "@/stores/cctv-store";
import { LucideIcon } from "lucide-react";

// Helper functions for colors and icons
const getColorsForType = (type: LocationType) => {
  switch (type) {
    case "gas":
      return {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800/50",
        ring: "ring-orange-500",
        iconBg: "bg-orange-500",
      };
    case "bank":
      return {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800/50",
        ring: "ring-emerald-500",
        iconBg: "bg-emerald-500",
      };
    case "clothing":
      return {
        bg: "bg-violet-100 dark:bg-violet-900/30",
        text: "text-violet-700 dark:text-violet-400",
        border: "border-violet-200 dark:border-violet-800/50",
        ring: "ring-violet-500",
        iconBg: "bg-violet-500",
      };
    case "ammunation":
      return {
        bg: "bg-rose-100 dark:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-400",
        border: "border-rose-200 dark:border-rose-800/50",
        ring: "ring-rose-500",
        iconBg: "bg-rose-500",
      };
    case "phone":
      return {
        bg: "bg-sky-100 dark:bg-sky-900/30",
        text: "text-sky-700 dark:text-sky-400",
        border: "border-sky-200 dark:border-sky-800/50",
        ring: "ring-sky-500",
        iconBg: "bg-sky-500",
      };
    default:
      return {
        bg: "bg-neutral-100 dark:bg-neutral-800",
        text: "text-neutral-700 dark:text-neutral-400",
        border: "border-neutral-200 dark:border-neutral-700",
        ring: "ring-neutral-500",
        iconBg: "bg-neutral-500",
      };
  }
};

const getIconForType = (type: LocationType): LucideIcon => {
  switch (type) {
    case "gas":
      return Fuel;
    case "bank":
      return Banknote;
    case "clothing":
      return Shirt;
    case "ammunation":
      return Target;
    case "phone":
      return Smartphone;
    default:
      return Building;
  }
};

export default function LocationList() {
  const {
    filteredLocations,
    activeLocation,
    setActiveLocation,
  } = useCCTVStore();

  return (
    <Card className="glass-card h-full flex flex-col overflow-hidden border-0 shadow-xl">
      <CardHeader className="pb-4 border-b border-neutral-100 dark:border-neutral-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Camera List</CardTitle>
            <CardDescription className="text-neutral-500 dark:text-neutral-400 mt-1">
              Showing {filteredLocations.length} available cameras
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <div className="p-4 space-y-3">
          {filteredLocations.map((location, index) => {
            const colors = getColorsForType(location.type);
            const Icon = getIconForType(location.type);
            const isSelected = activeLocation?.id === location.id;

            return (
              <div
                key={location.id}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${isSelected
                  ? `bg-indigo-50/80 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 shadow-md transform scale-[1.01]`
                  : `bg-white dark:bg-zinc-900 border-neutral-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-md hover:-translate-y-0.5`
                  } animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setActiveLocation(location)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shadow-sm ${isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'} transition-colors duration-300`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold truncate transition-colors ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                          {location.name}
                        </h3>
                        {location.enabled ? (
                          <Video size={14} className="text-emerald-500 animate-pulse" />
                        ) : (
                          <VideoOff size={14} className="text-neutral-400" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge
                          variant="secondary"
                          className={`text-xs font-medium border-0 px-2 py-0.5 h-5 ${colors.bg} ${colors.text}`}
                        >
                          {location.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                          <span>X:{location.coordinates[0].toFixed(0)}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                          <span>Y:{location.coordinates[1].toFixed(0)}</span>
                        </span>
                      </div>

                      {location.description && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-1 group-hover:line-clamp-none transition-all">
                          {location.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <ChevronRight size={16} className={`text-neutral-300 dark:text-neutral-600 transition-transform duration-300 ${isSelected ? 'text-indigo-400 rotate-90' : 'group-hover:text-indigo-400 group-hover:translate-x-1'}`} />
                  </div>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-600 rounded-r-full" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
