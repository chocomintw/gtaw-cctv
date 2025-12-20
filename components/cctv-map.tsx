// app/components/cctv-map.tsx - Clean working version
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from 'next/dynamic';
import { useCCTVStore } from "../stores/cctv-store";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, AlertCircle, Layers } from "lucide-react";
import { Badge } from "./ui/badge";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// EXACT transformation from original GTAW project
const GTAW_CONFIG = {
  // From original index.html: 
  // transformation: new L.Transformation(0.02072, 117.3, -0.0205, 172.8)
  scaleX: 0.02072,
  offsetX: 117.3,
  scaleY: -0.0205,    // NEGATIVE scale for Y
  offsetY: 172.8,     // POSITIVE offset for Y
  
  tileUrls: {
    atlas: 'https://map.gta.world/mapStyles/styleAtlas/{z}/{x}/{y}.jpg',
    satellite: 'https://map.gta.world/mapStyles/styleSatelite/{z}/{x}/{y}.jpg',
    grid: 'https://map.gta.world/mapStyles/styleGrid/{z}/{x}/{y}.png',
    street: 'https://map.gta.world/mapStyles/styleStreet/{z}/{x}/{y}.jpg'
  },
  
  attribution: 'made by monster & george?',
  
  // Original view from GTAW project
  initialView: [-1192.7, -135.1] as [number, number],
  initialZoom: 3,
  minZoom: 1,
  maxZoom: 5,
  maxNativeZoom: 5,
};

export default function CCTVMap() {
  const { locations, activeLocation, setActiveLocation } = useEmergencyStore();
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState<any>(null);
  const [customCRS, setCustomCRS] = useState<any>(null);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'atlas' | 'street' | 'grid'>('satellite');

  const activeLocations = useMemo(
    () => locations.filter((loc) => loc.enabled),
    [locations]
  );

  const getColorForType = (type: string) => {
    switch (type) {
      case 'police': return { text: 'text-blue-600', border: 'border-blue-300', bg: 'bg-blue-100' };
      case 'fire': return { text: 'text-red-600', border: 'border-red-300', bg: 'bg-red-100' };
      case 'hospital': return { text: 'text-green-600', border: 'border-green-300', bg: 'bg-green-100' };
      case 'lifeguard': return { text: 'text-orange-600', border: 'border-orange-300', bg: 'bg-orange-100' };
      case 'prison': return { text: 'text-purple-600', border: 'border-purple-300', bg: 'bg-purple-100' };
      case 'impound': return { text: 'text-gray-600', border: 'border-gray-300', bg: 'bg-gray-100' };
      default: return { text: 'text-gray-600', border: 'border-gray-300', bg: 'bg-gray-100' };
    }
  };

  // Create custom CRS with EXACT original transformation
  const createCustomCRS = useCallback(() => {
    if (typeof window === 'undefined' || !leafletLoaded) return null;
    
    const L = leafletLoaded;
    
    return L.extend({}, L.CRS.Simple, {
      projection: L.Projection.LonLat,
      transformation: new L.Transformation(
        GTAW_CONFIG.scaleX,
        GTAW_CONFIG.offsetX,
        GTAW_CONFIG.scaleY,  // NEGATIVE (-0.0205)
        GTAW_CONFIG.offsetY,  // POSITIVE (172.8)
      ),
      distance: function (pos1: any, pos2: any) {
        const xDiff = pos2.lng - pos1.lng;
        const yDiff = pos2.lat - pos1.lat;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      },
      scale: function (zoom: number) {
        return Math.pow(2, zoom);
      },
      zoom: function (sc: number) {
        return Math.log(sc) / 0.6931471805599453;
      },
      infinite: true,
    });
  }, [leafletLoaded]);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
          iconUrl: "/leaflet/images/marker-icon.png",
          shadowUrl: "/leaflet/images/marker-shadow.png",
        });
        
        setLeafletLoaded(L);
        
        const crs = createCustomCRS();
        setCustomCRS(crs);
      });
    }
  }, [createCustomCRS]);

  if (!isClient || !leafletLoaded) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading GTA World map...</p>
        </div>
      </Card>
    );
  }

  const getActiveTileUrl = () => {
    switch (activeLayer) {
      case 'satellite': return GTAW_CONFIG.tileUrls.satellite;
      case 'atlas': return GTAW_CONFIG.tileUrls.atlas;
      case 'street': return GTAW_CONFIG.tileUrls.street;
      case 'grid': return GTAW_CONFIG.tileUrls.grid;
      default: return GTAW_CONFIG.tileUrls.satellite;
    }
  };

  const mapCRS = customCRS || leafletLoaded.CRS.Simple;

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <MapPin size={20} />
          GTA World CCTV Map
          <Badge variant="outline" className="ml-2">
            {activeLocations.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        {mapCRS ? (
          <MapContainer
            center={GTAW_CONFIG.initialView}
            zoom={GTAW_CONFIG.initialZoom}
            crs={mapCRS}
            className="h-full w-full"
            style={{ height: "500px", width: "100%" }}
            minZoom={GTAW_CONFIG.minZoom}
            maxZoom={GTAW_CONFIG.maxZoom}
            preferCanvas={true}
          >
            <TileLayer
              attribution={GTAW_CONFIG.attribution}
              url={getActiveTileUrl()}
              minZoom={GTAW_CONFIG.minZoom}
              maxZoom={GTAW_CONFIG.maxZoom}
              maxNativeZoom={GTAW_CONFIG.maxNativeZoom}
              noWrap={false}
            />
            
            {/* Simple Layer Control */}
            <div className="leaflet-top leaflet-right">
              <div className="leaflet-control leaflet-bar bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg m-4 border">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-neutral-600" />
                    <span className="text-sm font-medium">Map Style</span>
                  </div>
                  <div className="space-y-2">
                    {(['satellite', 'atlas', 'street', 'grid'] as const).map((style) => (
                      <label key={style} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mapLayer"
                          value={style}
                          checked={activeLayer === style}
                          onChange={(e) => setActiveLayer(e.target.value as any)}
                          className="text-indigo-600"
                        />
                        <span className="text-sm capitalize">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Markers with [X, Y] coordinates */}
            {activeLocations.map((location) => {
              const coords: [number, number] = [location.coordinates[0], location.coordinates[1]];
              const colors = getColorForType(location.type);
              
              return (
                <Marker
                  key={location.id}
                  position={coords}
                  eventHandlers={{
                    click: () => setActiveLocation(location),
                  }}
                >
                  <Popup>
                    <div className="p-3 min-w-[250px]">
                      <h3 className="font-bold text-base mb-2">{location.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`mb-3 ${colors.text} ${colors.border}`}
                      >
                        {location.type.toUpperCase()}
                      </Badge>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">GTA Coordinates: </span>
                          <span className="font-mono text-xs">
                            X: {location.coordinates[0].toFixed(1)}, Y: {location.coordinates[1].toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">
                          {location.description}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            
            {/* Map Legend */}
            <div className="leaflet-bottom leaflet-right">
              <div className="leaflet-control leaflet-bar bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg m-4 border">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    <span className="text-sm">Police Stations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-600"></div>
                    <span className="text-sm">Fire Stations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-600"></div>
                    <span className="text-sm">Hospitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                    <span className="text-sm">Lifeguard</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <AlertCircle size={12} />
                      <span>Click markers for details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-neutral-600">Setting up map coordinate system...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}