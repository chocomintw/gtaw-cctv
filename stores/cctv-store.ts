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
}

interface CCTVStore {
  locations: CCTVLocation[];
  activeLocation: CCTVLocation | null;
  filteredLocations: CCTVLocation[];
  filter: string;
  selectedTypes: LocationType[];
  
  // Actions
  setActiveLocation: (location: CCTVLocation | null) => void;
  setFilter: (filter: string) => void;
  toggleLocationType: (type: LocationType) => void;
  toggleLocation: (id: string) => void;
  loadLocations: (locations: CCTVLocation[]) => void;
  resetFilters: () => void;
}

export const useCCTVStore = create<CCTVStore>((set, get) => ({
  locations: [],
  activeLocation: null,
  filteredLocations: [],
  filter: '',
  selectedTypes: ['gas', 'clothing', 'bank', 'ammunation', 'phone', 'other'],
  
  setActiveLocation: (location) => set({ activeLocation: location }),
  
  setFilter: (filter) => set((state) => {
    const filtered = filterLocations(state.locations, filter, state.selectedTypes);
    return { filter, filteredLocations: filtered };
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
    filteredLocations: get().locations
  }),
}));

// Helper function for filtering
function filterLocations(
  locations: CCTVLocation[], 
  filter: string, 
  selectedTypes: LocationType[]
): CCTVLocation[] {
  return locations.filter(location => {
    const matchesType = selectedTypes.includes(location.type);
    const matchesFilter = !filter || 
      location.name.toLowerCase().includes(filter.toLowerCase()) ||
      location.description.toLowerCase().includes(filter.toLowerCase());
    
    return matchesType && matchesFilter;
  });
}