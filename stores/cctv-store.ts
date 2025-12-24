// app/stores/cctv-store.ts
import { create } from 'zustand';

export type LocationType = 'gas' | 'clothing' | 'bank' | 'ammunation' | 'phone' | 'other';

export interface CCTVLocation {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: LocationType;
  enabled: boolean;
  z?: number; // Optional if you have 3D coordinates
  rotation?: number; // Optional rotation value
}

interface CCTVStore {
  locations: CCTVLocation[];
  activeLocation: CCTVLocation | null;
  filteredLocations: CCTVLocation[];
  filter: string;
  selectedTypes: LocationType[];
  targetCoordinates: [number, number] | null;

  // Actions
  setActiveLocation: (location: CCTVLocation | null) => void;
  setFilter: (filter: string) => void;
  toggleLocationType: (type: LocationType) => void;
  toggleLocation: (id: string) => void;
  loadLocations: (locations: CCTVLocation[]) => void;
  resetFilters: () => void;
  setTargetCoordinates: (coords: [number, number] | null) => void;
}

export const useCCTVStore = create<CCTVStore>((set, get) => ({
  locations: [],
  activeLocation: null,
  filteredLocations: [],
  filter: '',
  selectedTypes: ['gas', 'clothing', 'bank', 'ammunation', 'phone', 'other'],
  targetCoordinates: null,

  setActiveLocation: (location) => set({ activeLocation: location }),

  setFilter: (filter) => set((state) => {
    const filtered = filterLocations(state.locations, filter, state.selectedTypes);

    // Check if filter is coordinates and extract them
    const cleanedFilter = filter.trim().replace(/^\(?\s*/, '').replace(/\s*\)?$/, '');
    const coordRegex = /^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)(?:[,\s]+-?\d+(?:\.\d+)?)?$/;
    const match = cleanedFilter.match(coordRegex);

    const targetCoords = match ? [parseFloat(match[1]), parseFloat(match[2])] as [number, number] : null;

    return { filter, filteredLocations: filtered, targetCoordinates: targetCoords };
  }),

  toggleLocationType: (type) => set((state) => {
    const newSelectedTypes = state.selectedTypes.includes(type)
      ? state.selectedTypes.filter(t => t !== type)
      : [...state.selectedTypes, type];

    const filtered = filterLocations(state.locations, state.filter, newSelectedTypes);
    return { selectedTypes: newSelectedTypes, filteredLocations: filtered };
  }),

  toggleLocation: (id) => set((state) => ({
    locations: state.locations.map(loc =>
      loc.id === id ? { ...loc, enabled: !loc.enabled } : loc
    )
  })),

  loadLocations: (locations) => set({
    locations,
    filteredLocations: locations
  }),

  resetFilters: () => set({
    filter: '',
    selectedTypes: ['gas', 'clothing', 'bank', 'ammunation', 'phone', 'other'],
    filteredLocations: get().locations,
    targetCoordinates: null
  }),

  setTargetCoordinates: (coords) => set({ targetCoordinates: coords }),
}));

// Helper function for filtering
function filterLocations(
  locations: CCTVLocation[],
  filter: string,
  selectedTypes: LocationType[]
): CCTVLocation[] {
  // Check if filter is valid coordinates
  // Matches "x, y", "x y", "x, y, z" etc., with optional parentheses and flexible whitespace
  // First strip parentheses and extra whitespace for more robust matching
  const cleanedFilter = filter.trim().replace(/^\(?\s*/, '').replace(/\s*\)?$/, '');
  const coordRegex = /^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)(?:[,\s]+-?\d+(?:\.\d+)?)?$/;
  const match = cleanedFilter.match(coordRegex);

  if (match) {
    const targetX = parseFloat(match[1]);
    const targetY = parseFloat(match[2]);

    // Calculate distance and sort
    return [...locations]
      .filter(location => selectedTypes.includes(location.type))
      .sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.coordinates[0] - targetX, 2) +
          Math.pow(a.coordinates[1] - targetY, 2)
        );
        const distB = Math.sqrt(
          Math.pow(b.coordinates[0] - targetX, 2) +
          Math.pow(b.coordinates[1] - targetY, 2)
        );
        return distA - distB;
      });
  }

  // Standard filtering
  return locations.filter(location => {
    const matchesType = selectedTypes.includes(location.type);
    const matchesFilter = !filter ||
      location.name.toLowerCase().includes(filter.toLowerCase()) ||
      location.description.toLowerCase().includes(filter.toLowerCase()) ||
      location.id.includes(filter); // Also allow searching by ID

    return matchesType && matchesFilter;
  });
}