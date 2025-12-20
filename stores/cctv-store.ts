// app/stores/cctv-store.ts
import { create } from "zustand";

export interface CCTVLocation {
  id: string;
  name: string;
  x: number; // GTA coordinates
  y: number;
  z?: number;
  rotation?: number; // Camera rotation
  description?: string;
  enabled: boolean;
}

interface CCTVStore {
  locations: CCTVLocation[];
  activeLocation: CCTVLocation | null;
  filteredLocations: CCTVLocation[];
  filter: string;

  // Actions
  setActiveLocation: (location: CCTVLocation | null) => void;
  setFilter: (filter: string) => void;
  toggleLocation: (id: string) => void;
  loadLocations: (locations: CCTVLocation[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCCTVStore = create<CCTVStore>((set, get) => ({
  locations: [],
  activeLocation: null,
  filteredLocations: [],
  filter: "",

  setActiveLocation: (location) => set({ activeLocation: location }),

  setFilter: (filter) =>
    set((state) => ({
      filter,
      filteredLocations: filter
        ? state.locations.filter(
            (loc) =>
              loc.name.toLowerCase().includes(filter.toLowerCase()) ||
              loc.description?.toLowerCase().includes(filter.toLowerCase()),
          )
        : state.locations,
    })),

  toggleLocation: (id) =>
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.id === id ? { ...loc, enabled: !loc.enabled } : loc,
      ),
    })),

  loadLocations: (locations) =>
    set({
      locations,
      filteredLocations: locations,
    }),
}));
