// app/data/locations.ts
import {
  Building,
  Lock,
  Truck,
  FlameKindling,
  Stethoscope,
  LifeBuoy,
  Phone,
  MapPin,
} from "lucide-react";

export type LocationType =
  | "government"
  | "police"
  | "fire"
  | "hospital"
  | "lifeguard"
  | "prison"
  | "impound"
  | "emergency";

// Map Lucide icons to location types
export const locationTypeIcons = {
  government: Building,
  police: Building,
  fire: FlameKindling,
  hospital: Stethoscope,
  lifeguard: LifeBuoy,
  prison: Lock,
  impound: Truck,
  emergency: Phone,
};

// Map type to Tailwind color classes (using your indigo theme)
export const locationTypeColors: Record<
  LocationType,
  {
    bg: string;
    text: string;
    border: string;
    ring: string;
  }
> = {
  government: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    ring: "ring-blue-500",
  },
  police: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    ring: "ring-indigo-500",
  },
  fire: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    ring: "ring-red-500",
  },
  hospital: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    ring: "ring-green-500",
  },
  lifeguard: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    ring: "ring-orange-500",
  },
  prison: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    ring: "ring-purple-500",
  },
  impound: {
    bg: "bg-slate-50 dark:bg-slate-950/30",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    ring: "ring-slate-500",
  },
  emergency: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    ring: "ring-rose-500",
  },
};

export interface EmergencyLocation {
  id: string;
  name: string;
  coordinates: [number, number];
  type: LocationType;
  description: string;
  enabled: boolean;
}

// Converted from your locations.js - now with Lucide icons
export const emergencyLocations: EmergencyLocation[] = [
  // Police Stations and Government Buildings
  {
    id: "gov-01",
    name: "Mission Row Community Police Station",
    coordinates: [-994.5, 457.6],
    type: "police",
    description: "Mission Row Community Police Station",
    enabled: true,
  },
  {
    id: "gov-02",
    name: "Vespucci Headquarters",
    coordinates: [-849.7, -1083.8],
    type: "police",
    description: "Vespucci Headquarters",
    enabled: true,
  },
  {
    id: "gov-03",
    name: "Twin Towers Correctional Facility",
    coordinates: [-375.6, 2484.6],
    type: "prison",
    description: "Twin Towers Correctional Facility",
    enabled: true,
  },
  {
    id: "gov-04",
    name: "LSPD Impound Lot",
    coordinates: [-1631.7, 418.4],
    type: "impound",
    description: "LSPD Impound Lot",
    enabled: true,
  },
  {
    id: "gov-05",
    name: "Sandy Shores Sheriff's Station",
    coordinates: [3696.0, 1818.0],
    type: "police",
    description: "Sandy Shores Sheriff's Station",
    enabled: true,
  },
  {
    id: "gov-06",
    name: "Rockford Hills Community Police Station",
    coordinates: [-131.7, -580.1],
    type: "police",
    description: "Rockford Hills Community Police Station",
    enabled: true,
  },

  // Fire Stations
  {
    id: "fire-01",
    name: "Station 1 - Paleto Bay Fire Station",
    coordinates: [6141.2, -353.8],
    type: "fire",
    description: "Station 1 - Paleto Bay Fire Station",
    enabled: true,
  },
  {
    id: "fire-03",
    name: "Station 3 - Davis Fire Station",
    coordinates: [-1660.7, 214.8],
    type: "fire",
    description: "Station 3 - Davis Fire Station",
    enabled: true,
  },
  {
    id: "fire-04",
    name: "Station 4 - Sandy Shores Fire Station",
    coordinates: [3603.0, 1694.3],
    type: "fire",
    description: "Station 4 - Sandy Shores Fire Station",
    enabled: true,
  },
  {
    id: "fire-05",
    name: "Station 5 - Fort Zancudo Fire Station",
    coordinates: [2831.7, -2085.2],
    type: "fire",
    description: "Station 5 - Fort Zancudo Fire Station",
    enabled: true,
  },
  {
    id: "fire-06",
    name: "Station 6 - Los Santos International Airport Fire Station",
    coordinates: [-2371.0, -1044.6],
    type: "fire",
    description: "Station 6 - Los Santos International Airport Fire Station",
    enabled: true,
  },
  {
    id: "fire-07",
    name: "Station 7 - El Burro Heights Fire Station",
    coordinates: [-1486.9, 1204.2],
    type: "fire",
    description: "Station 7 - El Burro Heights Fire Station",
    enabled: true,
  },

  // Hospitals
  {
    id: "hosp-01",
    name: "The Bay Care Center",
    coordinates: [6363.7, -246.7],
    type: "hospital",
    description: "The Bay Care Center",
    enabled: true,
  },
  {
    id: "hosp-02",
    name: "Central Los Santos Medical Center",
    coordinates: [-1418.3, 356.5],
    type: "hospital",
    description: "Central Los Santos Medical Center",
    enabled: true,
  },
  {
    id: "hosp-03",
    name: "Sandy Shores Medical Center",
    coordinates: [3718.9, 1851.2],
    type: "hospital",
    description: "Sandy Shores Medical Center",
    enabled: true,
  },
  {
    id: "hosp-04",
    name: "Saint Fiacre Hospital",
    coordinates: [-1552.4, 1136.3],
    type: "hospital",
    description: "Saint Fiacre Hospital",
    enabled: true,
  },
  {
    id: "hosp-05",
    name: "Mount Zonah Medical Center",
    coordinates: [-319.2, -491.1],
    type: "hospital",
    description: "Mount Zonah Medical Center",
    enabled: true,
  },
  {
    id: "hosp-06",
    name: "Pillbox Hill Medical Center",
    coordinates: [-582.9, 329.4],
    type: "hospital",
    description: "Pillbox Hill Medical Center",
    enabled: true,
  },

  // Lifeguard Stations
  {
    id: "life-01",
    name: "Vespucci Beach Lifeguard Station",
    coordinates: [-1787.2, -1180.3],
    type: "lifeguard",
    description: "Vespucci Beach Lifeguard Station",
    enabled: true,
  },
  {
    id: "life-02",
    name: "Del Perro Beach Lifeguard Station",
    coordinates: [-993.0, -1475.9],
    type: "lifeguard",
    description: "Del Perro Beach Lifeguard Station",
    enabled: true,
  },
];

// Helper function to get locations by type
export function getLocationsByType(type: LocationType): EmergencyLocation[] {
  return emergencyLocations.filter((location) => location.type === type);
}

// Get all location types present
export function getAllLocationTypes(): LocationType[] {
  return [...new Set(emergencyLocations.map((loc) => loc.type))];
}

// Get icon component for a location type
export function getIconForType(type: LocationType) {
  return locationTypeIcons[type] || MapPin;
}

// Get color classes for a location type
export function getColorsForType(type: LocationType) {
  return locationTypeColors[type] || locationTypeColors.government;
}
