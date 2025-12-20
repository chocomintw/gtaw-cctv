// app/lib/convert-locations.ts
// This will help convert the original JS format to our TypeScript format

export function convertOriginalLocations(originalData: any[]): CCTVLocation[] {
  return originalData.map((item, index) => ({
    id: `cctv-${index + 1}`,
    name: item.name || `CCTV ${index + 1}`,
    x: item.x || 0,
    y: item.y || 0,
    z: item.z || 0,
    rotation: item.rotation || 0,
    description: item.description || "",
    enabled: true,
  }));
}

// Temporary hardcoded data based on original project
export const initialLocations: CCTVLocation[] = [
  {
    id: "cctv-1",
    name: "Vinewood Blvd",
    x: 300.0,
    y: -200.0,
    z: 45.0,
    rotation: 90,
    description: "Main Vinewood boulevard intersection",
    enabled: true,
  },
  // Add more based on actual locations.js
];
