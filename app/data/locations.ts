// app/data/locations.ts
export type LocationType =
  | "government"
  | "police"
  | "fire"
  | "hospital"
  | "lifeguard"
  | "prison"
  | "impound";

export interface EmergencyLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [x, y] based on your original data
  type: LocationType;
  description: string;
  icon: {
    markerColor: string;
    iconColor: string;
    faIcon: string;
  };
  enabled: boolean;
}

// Converted from your locations.js
export const emergencyLocations: EmergencyLocation[] = [
  // Police Stations and Government Buildings
  {
    id: "gov-01",
    name: "Mission Row Community Police Station",
    coordinates: [-994.5, 457.6],
    type: "government",
    description: "Mission Row Community Police Station",
    icon: {
      markerColor: "cadetblue",
      iconColor: "white",
      faIcon: "building",
    },
    enabled: true,
  },
  {
    id: "gov-02",
    name: "Vespucci Headquarters",
    coordinates: [-849.7, -1083.8],
    type: "government",
    description: "Vespucci Headquarters",
    icon: {
      markerColor: "cadetblue",
      iconColor: "white",
      faIcon: "building",
    },
    enabled: true,
  },
  {
    id: "gov-03",
    name: "Twin Towers Correctional Facility",
    coordinates: [-375.6, 2484.6],
    type: "prison",
    description: "Twin Towers Correctional Facility",
    icon: {
      markerColor: "cadetblue",
      iconColor: "white",
      faIcon: "lock",
    },
    enabled: true,
  },
  {
    id: "gov-04",
    name: "LSPD Impound Lot",
    coordinates: [-1631.7, 418.4],
    type: "impound",
    description: "LSPD Impound Lot",
    icon: {
      markerColor: "cadetblue",
      iconColor: "white",
      faIcon: "truck-pickup",
    },
    enabled: true,
  },
  {
    id: "gov-05",
    name: "Sandy Shores Sheriff's Station",
    coordinates: [3696.0, 1818.0],
    type: "government",
    description: "Sandy Shores Sheriff's Station",
    icon: {
      markerColor: "cadetblue",
      iconColor: "white",
      faIcon: "building",
    },
    enabled: true,
  },
  {
    id: "gov-06",
    name: "Rockford Hills Community Police Station",
    coordinates: [-131.7, -580.1],
    type: "government",
    description: "Rockford Hills Community Police Station",
    icon: {
      markerColor: "cadetblue",
      iconColor: "white",
      faIcon: "building",
    },
    enabled: true,
  },

  // Fire Stations
  {
    id: "fire-01",
    name: "Station 1 - Paleto Bay Fire Station",
    coordinates: [6141.2, -353.8],
    type: "fire",
    description: "Station 1 - Paleto Bay Fire Station",
    icon: {
      markerColor: "darkred",
      iconColor: "white",
      faIcon: "fire-extinguisher",
    },
    enabled: true,
  },
  {
    id: "fire-03",
    name: "Station 3 - Davis Fire Station",
    coordinates: [-1660.7, 214.8],
    type: "fire",
    description: "Station 3 - Davis Fire Station",
    icon: {
      markerColor: "darkred",
      iconColor: "white",
      faIcon: "fire-extinguisher",
    },
    enabled: true,
  },
  {
    id: "fire-04",
    name: "Station 4 - Sandy Shores Fire Station",
    coordinates: [3603.0, 1694.3],
    type: "fire",
    description: "Station 4 - Sandy Shores Fire Station",
    icon: {
      markerColor: "darkred",
      iconColor: "white",
      faIcon: "fire-extinguisher",
    },
    enabled: true,
  },
  {
    id: "fire-05",
    name: "Station 5 - Fort Zancudo Fire Station",
    coordinates: [2831.7, -2085.2],
    type: "fire",
    description: "Station 5 - Fort Zancudo Fire Station",
    icon: {
      markerColor: "darkred",
      iconColor: "white",
      faIcon: "fire-extinguisher",
    },
    enabled: true,
  },
  {
    id: "fire-06",
    name: "Station 6 - Los Santos International Airport Fire Station",
    coordinates: [-2371.0, -1044.6],
    type: "fire",
    description: "Station 6 - Los Santos International Airport Fire Station",
    icon: {
      markerColor: "darkred",
      iconColor: "white",
      faIcon: "fire-extinguisher",
    },
    enabled: true,
  },
  {
    id: "fire-07",
    name: "Station 7 - El Burro Heights Fire Station",
    coordinates: [-1486.9, 1204.2],
    type: "fire",
    description: "Station 7 - El Burro Heights Fire Station",
    icon: {
      markerColor: "darkred",
      iconColor: "white",
      faIcon: "fire-extinguisher",
    },
    enabled: true,
  },

  // Hospitals
  {
    id: "hosp-01",
    name: "The Bay Care Center",
    coordinates: [6363.7, -246.7],
    type: "hospital",
    description: "The Bay Care Center",
    icon: {
      markerColor: "green",
      iconColor: "white",
      faIcon: "briefcase-medical",
    },
    enabled: true,
  },
  {
    id: "hosp-02",
    name: "Central Los Santos Medical Center",
    coordinates: [-1418.3, 356.5],
    type: "hospital",
    description: "Central Los Santos Medical Center",
    icon: {
      markerColor: "green",
      iconColor: "white",
      faIcon: "briefcase-medical",
    },
    enabled: true,
  },
  {
    id: "hosp-03",
    name: "Sandy Shores Medical Center",
    coordinates: [3718.9, 1851.2],
    type: "hospital",
    description: "Sandy Shores Medical Center",
    icon: {
      markerColor: "green",
      iconColor: "white",
      faIcon: "briefcase-medical",
    },
    enabled: true,
  },
  {
    id: "hosp-04",
    name: "Saint Fiacre Hospital",
    coordinates: [-1552.4, 1136.3],
    type: "hospital",
    description: "Saint Fiacre Hospital",
    icon: {
      markerColor: "green",
      iconColor: "white",
      faIcon: "briefcase-medical",
    },
    enabled: true,
  },
  {
    id: "hosp-05",
    name: "Mount Zonah Medical Center",
    coordinates: [-319.2, -491.1],
    type: "hospital",
    description: "Mount Zonah Medical Center",
    icon: {
      markerColor: "green",
      iconColor: "white",
      faIcon: "briefcase-medical",
    },
    enabled: true,
  },
  {
    id: "hosp-06",
    name: "Pillbox Hill Medical Center",
    coordinates: [-582.9, 329.4],
    type: "hospital",
    description: "Pillbox Hill Medical Center",
    icon: {
      markerColor: "green",
      iconColor: "white",
      faIcon: "briefcase-medical",
    },
    enabled: true,
  },

  // Lifeguard Stations
  {
    id: "life-01",
    name: "Vespucci Beach Lifeguard Station",
    coordinates: [-1787.2, -1180.3],
    type: "lifeguard",
    description: "Vespucci Beach Lifeguard Station",
    icon: {
      markerColor: "orange",
      iconColor: "white",
      faIcon: "life-ring",
    },
    enabled: true,
  },
  {
    id: "life-02",
    name: "Del Perro Beach Lifeguard Station",
    coordinates: [-993.0, -1475.9],
    type: "lifeguard",
    description: "Del Perro Beach Lifeguard Station",
    icon: {
      markerColor: "orange",
      iconColor: "white",
      faIcon: "life-ring",
    },
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
