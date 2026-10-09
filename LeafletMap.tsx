'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Place, CitizenSafetyReport } from '@/types';
import { 
  MapPin, 
  Layers, 
  Compass, 
  ShieldAlert, 
  Navigation, 
  RotateCcw, 
  Search, 
  ExternalLink,
  Star,
  CheckCircle2,
  AlertTriangle,
  Info,
  Globe,
  Radio
} from 'lucide-react';
import PlaceDetailsModal from '@/components/explore/PlaceDetailsModal';

interface LeafletMapProps {
  onSelectPlace?: (place: Place) => void;
  selectedPlaceId?: string | null;
  heightClass?: string;
}

export default function LeafletMap({ 
  onSelectPlace, 
  selectedPlaceId,
  heightClass = 'h-[520px]' 
}: LeafletMapProps) {
  const { places, safetyReports, selectedCity, toggleSavePlace, isSaved } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  // Map Provider View: 'osm' | 'google'
  const [mapProvider, setMapProvider] = useState<'osm' | 'google'>('osm');
  const [activeFilter, setActiveFilter] = useState<'all' | 'places' | 'safety'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [modalPlace, setModalPlace] = useState<Place | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showRouteDemo, setShowRouteDemo] = useState(false);
  const [routeFrom, setRouteFrom] = useState(places[0]?.id || 'pune-1');
  const [routeTo, setRouteTo] = useState(places[1]?.id || 'pune-2');
  const [routePreference, setRoutePreference] = useState<'well-lit' | 'accessible' | 'scenic'>('well-lit');

  // Initialize Leaflet
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;
      if (typeof window === 'undefined') return;

      try {
        const L = (await import('leaflet')).default;

        if (!isMounted) return;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [selectedCity.center.lat, selectedCity.center.lng],
          zoom: selectedCity.zoom,
          zoomControl: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // High reliability standard OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        // Ensure tiles render immediately after mounting
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 600);

        setMapLoaded(true);
      } catch (err) {
        console.error('Error initializing Leaflet:', err);
      }
    }

    if (mapProvider === 'osm') {
      initMap();
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedCity, mapProvider]);

  // Handle Window Resizing to keep tiles crisp
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update Markers when filter, search, or places change
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markersLayerRef.current || mapProvider !== 'osm') return;

    async function renderMarkers() {
      const L = (await import('leaflet')).default;
      const markersLayer = markersLayerRef.current;
      markersLayer.clearLayers();

      const getPinHtml = (color: string, iconSymbol: string) => `
        <div style="
          width: 36px; 
          height: 36px; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          background: ${color}; 
          border: 2px solid #ffffff; 
          box-shadow: 0 4px 14px rgba(0,0,0,0.5); 
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            transform: rotate(45deg); 
            font-size: 14px; 
            font-weight: bold; 
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${iconSymbol}
          </div>
        </div>
      `;

      // Filter places
      let filteredPlaces = places;
      if (selectedCategory !== 'all') {
        filteredPlaces = filteredPlaces.filter((p) => p.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filteredPlaces = filteredPlaces.filter(
          (p) => p.name.toLowerCase().includes(q) || p.neighborhood.toLowerCase().includes(q)
        );
      }

      // Add Places Markers
      if (activeFilter === 'all' || activeFilter === 'places') {
        filteredPlaces.forEach((place) => {
          let pinColor = '#10b981'; // Cyber emerald
          let symbol = '📍';

          if (place.category === 'heritage') {
            pinColor = '#f59e0b';
            symbol = '🏛️';
          } else if (place.category === 'restaurant') {
            pinColor = '#f97316';
            symbol = '🍲';
          } else if (place.category === 'hotel') {
            pinColor = '#8b5cf6';
            symbol = '🏨';
          } else if (place.category === 'attraction') {
            pinColor = '#059669';
            symbol = '🌿';
          } else if (place.category === 'budget') {
            pinColor = '#00f59b';
            symbol = '☕';
          } else if (place.category === 'shopping') {
            pinColor = '#ec4899';
            symbol = '🛍️';
          }

          const customIcon = L.divIcon({
            className: 'custom-leaflet-pin',
            html: getPinHtml(pinColor, symbol),
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -34],
          });

          const marker = L.marker([place.coordinates.lat, place.coordinates.lng], { icon: customIcon });

          const popupContent = `
            <div style="font-family: inherit; width: 240px; padding: 2px;">
              <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <div style="font-size: 11px; font-weight: 800; color: #10b981; text-transform: uppercase;">${place.categoryLabel}</div>
              <div style="font-size: 14px; font-weight: 800; color: #f0fdf4; margin-top: 2px; line-height: 1.2;">${place.name}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">📍 ${place.neighborhood}</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 11px; font-weight: bold;">
                <span style="color: #fbbf24;">★ ${place.rating.toFixed(1)} (${place.reviewCount})</span>
                <span style="color: #34d399;">${place.priceLevel} (~₹${place.estimatedCostINR || 50})</span>
              </div>
              <div style="margin-top: 6px; padding: 6px 8px; background: #061510; border: 1px solid #133e31; border-radius: 6px; font-size: 10px; color: #cbd5e1;">
                <strong style="color: #6ee7b7;">Safety Note:</strong> ${place.safetyGuidanceNotes.slice(0, 90)}...
              </div>
              <div style="margin-top: 8px; display: flex; gap: 4px;">
                <a href="https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}" target="_blank" rel="noreferrer" style="display: block; width: 100%; text-align: center; padding: 5px; background: #10b981; color: #040d09; font-weight: bold; border-radius: 6px; text-decoration: none; font-size: 11px;">
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('click', () => {
            setActivePlace(place);
            if (onSelectPlace) onSelectPlace(place);
          });

          marker.addTo(markersLayer);
        });
      }

      // Add Safety Hazard Pins
      if (activeFilter === 'all' || activeFilter === 'safety') {
        safetyReports.forEach((rep) => {
          if (!rep.coordinates) return;

          const severityColor = rep.severity === 'warning' ? '#ef4444' : rep.severity === 'caution' ? '#f59e0b' : '#3b82f6';
          const symbol = '⚠️';

          const hazardIcon = L.divIcon({
            className: 'custom-leaflet-hazard-pin',
            html: getPinHtml(severityColor, symbol),
            iconSize: [34, 34],
            iconAnchor: [17, 34],
            popupAnchor: [0, -32],
          });

          const marker = L.marker([rep.coordinates.lat, rep.coordinates.lng], { icon: hazardIcon });

          const popupContent = `
            <div style="font-family: inherit; width: 230px; padding: 2px;">
              <div style="display: inline-block; padding: 2px 6px; border-radius: 4px; background: ${severityColor}25; color: ${severityColor}; font-size: 10px; font-weight: 800; text-transform: uppercase;">
                ${rep.category} • ${rep.severity.toUpperCase()}
              </div>
              <div style="font-size: 13px; font-weight: 800; color: #f0fdf4; margin-top: 4px;">${rep.title}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">📍 ${rep.neighborhood}</div>
              <p style="font-size: 11px; color: #cbd5e1; margin-top: 6px; line-height: 1.3;">${rep.description}</p>
              <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Status: ${rep.verifiedStatus} • ${rep.upvotes} upvotes</div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(markersLayer);
        });
      }
    }

    renderMarkers();
  }, [places, safetyReports, activeFilter, selectedCategory, searchQuery, mapLoaded, mapProvider]);

  // Center on selected place if provided externally
  useEffect(() => {
    if (!selectedPlaceId || !mapInstanceRef.current) return;
    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      mapInstanceRef.current.flyTo([place.coordinates.lat, place.coordinates.lng], 15, {
        duration: 1.2,
      });
      setActivePlace(place);
    }
  }, [selectedPlaceId, places]);

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedCity.center.lat, selectedCity.center.lng], selectedCity.zoom, {
        duration: 1.0,
      });
    }
  };

  const handleFlyTo = (place: Place) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([place.coordinates.lat, place.coordinates.lng], 15, {
        duration: 1.2,
      });
      setActivePlace(place);
      if (onSelectPlace) onSelectPlace(place);
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'heritage', label: '🏛️ Heritage' },
    { id: 'restaurant', label: '🍲 Food & Dining' },
    { id: 'attraction', label: '🌿 Parks & Forts' },
    { id: 'budget', label: '☕ Budget Cafes' },
    { id: 'shopping', label: '🛍️ Shopping' },
    { id: 'hotel', label: '🏨 Hotels' },
  ];

  const originPlace = places.find((p) => p.id === routeFrom) || places[0];
  const destPlace = places.find((p) => p.id === routeTo) || places[1] || places[0];

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    activePlace ? `${activePlace.name}, ${selectedCity.name}` : `${selectedCity.name}, ${selectedCity.state}`
  )}&t=&z=${selectedCity.zoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-4">
      {/* Map Header Toolbar with Provider Switcher */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-emerald-950/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Provider Toggle: OpenStreetMap vs Google Maps Live */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-emerald-900/40 text-xs">
            <button
              onClick={() => setMapProvider('osm')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mapProvider === 'osm'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe size={13} />
              <span>Interactive OSM Map</span>
            </button>
            <button
              onClick={() => setMapProvider('google')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mapProvider === 'google'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio size={13} />
              <span>Google Maps Live View</span>
            </button>
          </div>

          {/* Layer Filter Buttons (for OSM) */}
          {mapProvider === 'osm' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-emerald-900/40 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Pins ({places.length + safetyReports.length})
              </button>
              <button
                onClick={() => setActiveFilter('places')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === 'places' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Places ({places.length})
              </button>
              <button
                onClick={() => setActiveFilter('safety')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  activeFilter === 'safety' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hazards ({safetyReports.length})
              </button>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRouteDemo(!showRouteDemo)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                showRouteDemo 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900'
              }`}
            >
              <Navigation size={13} />
              <span>{showRouteDemo ? 'Hide Route Planner' : 'Safer Route Planner'}</span>
            </button>

            {mapProvider === 'osm' && (
              <button
                onClick={handleResetCenter}
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
                title={`Reset center to ${selectedCity.name}`}
              >
                <RotateCcw size={13} />
                <span>Reset View</span>
              </button>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedCity.center.lat},${selectedCity.center.lng}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
            >
              <span>Google Maps</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="“Your next favorite place is just one search away.”"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-emerald-900/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === c.id
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-semibold'
                    : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Safer Route Planner Drawer */}
      {showRouteDemo && (
        <div className="p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                <Navigation size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Safer Route Planning Advisory (DEMO)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Calculates paths prioritizing illuminated arterials and avoiding active hazard reports.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
              Guidance Only • Never 100% Safe
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Origin Location</label>
              <select
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:border-emerald-500"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Destination Location</label>
              <select
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:border-emerald-500"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Safety Focus</label>
              <select
                value={routePreference}
                onChange={(e) => setRoutePreference(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:border-emerald-500"
              >
                <option value="well-lit">High Lighting & CCTV Arterials (Recommended)</option>
                <option value="accessible">Step-Free Pavements & Wheelchair Access</option>
                <option value="scenic">Scenic Cultural & Heritage Corridor</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-emerald-400">{originPlace?.name}</span>
                <span>➔</span>
                <span className="text-mint-400 text-emerald-300">{destPlace?.name}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Estimated Transit: <strong>18-24 mins</strong> • Distance: <strong>6.4 km</strong> • Safe Lighting Score: <strong>9.2/10</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${originPlace?.coordinates.lat},${originPlace?.coordinates.lng}&destination=${destPlace?.coordinates.lat},${destPlace?.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
              >
                <span>Navigate in Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Map Canvas: Leaflet OpenStreetMap OR Google Maps Embed */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-950 shadow-2xl bg-slate-950">
        {mapProvider === 'osm' ? (
          <div 
            ref={mapContainerRef} 
            className={`w-full ${heightClass} z-10`}
            style={{ minHeight: '480px' }}
          />
        ) : (
          <div className={`w-full ${heightClass} relative`} style={{ minHeight: '480px' }}>
            <iframe
              src={googleMapsEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Live View"
            />
          </div>
        )}

        {/* Selected Landmark Quick Action Card Overlay (Bottom Left) */}
        {activePlace && (
          <div className="absolute bottom-4 left-4 z-20 max-w-sm w-full bg-slate-950/95 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl animate-in fade-in duration-200">
            <div className="flex gap-3">
              <img
                src={activePlace.imageUrl}
                alt={activePlace.name}
                className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate">
                    {activePlace.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-amber-300 font-bold text-xs">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{activePlace.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white truncate mt-0.5">
                  {activePlace.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  📍 {activePlace.neighborhood}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setModalPlace(activePlace)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1"
                  >
                    <span>Full Details</span>
                    <ExternalLink size={10} />
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${activePlace.coordinates.lat},${activePlace.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-[11px] transition-all flex items-center gap-1"
                  >
                    <span>G-Maps</span>
                    <ExternalLink size={10} />
                  </a>
                  <button
                    onClick={() => setActivePlace(null)}
                    className="text-[11px] text-slate-400 hover:text-white ml-auto"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Synchronized Place Quick Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            {selectedCity.name} Landmark Coordinates ({places.length})
          </span>
          <span className="text-[11px] text-emerald-400">
            Click to locate on map & inspect details
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {places.slice(0, 6).map((p) => (
            <button
              key={p.id}
              onClick={() => handleFlyTo(p)}
              className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
                activePlace?.id === p.id
                  ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-emerald-700'
              }`}
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block truncate">
                  {p.categoryLabel}
                </span>
                <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mt-0.5">
                  {p.name}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>★ {p.rating.toFixed(1)}</span>
                <span className="text-emerald-400 font-semibold">{p.priceLevel}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Place Details Modal if opened */}
      {modalPlace && (
        <PlaceDetailsModal
          place={modalPlace}
          onClose={() => setModalPlace(null)}
        />
      )}
    </div>
  );
}
