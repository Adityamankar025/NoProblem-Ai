'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Place, CitizenSafetyReport } from '@/types';
import { 
  MapPin, 
  ShieldAlert, 
  Navigation, 
  Layers, 
  Eye, 
  Bookmark, 
  Scale, 
  Info,
  CheckCircle2,
  Compass,
  AlertTriangle
} from 'lucide-react';
import PlaceDetailsModal from '@/components/explore/PlaceDetailsModal';

interface MapPinItem {
  id: string;
  name: string;
  category: string;
  x: number; // percentage
  y: number; // percentage
  type: 'place' | 'hazard';
  severity?: 'caution' | 'warning' | 'info';
  placeData?: Place;
  reportData?: CitizenSafetyReport;
}

export default function InteractiveMapMock({ onOpenDetails }: { onOpenDetails?: (place: Place) => void }) {
  const { places, safetyReports, toggleSavePlace, isSaved, toggleComparePlace, isCompared } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'places' | 'safety'>('all');
  const [selectedPin, setSelectedPin] = useState<MapPinItem | null>(null);
  const [routeOrigin, setRouteOrigin] = useState<string>('place-7');
  const [routeDest, setRouteDest] = useState<string>('place-1');
  const [showRouteGuidance, setShowRouteGuidance] = useState<boolean>(false);
  const [modalPlace, setModalPlace] = useState<Place | null>(null);

  // Map coordinates mapped to 0-100% canvas positions
  const pinCoordinates: Record<string, { x: number; y: number }> = {
    'place-1': { x: 72, y: 28 }, // Old Citadel
    'place-2': { x: 58, y: 40 }, // Bazaar
    'place-3': { x: 82, y: 65 }, // Riverfront
    'place-4': { x: 42, y: 55 }, // Civic Cultural
    'place-5': { x: 30, y: 70 }, // Diplomatic
    'place-6': { x: 65, y: 32 }, // Stepwell
    'place-7': { x: 45, y: 45 }, // Downtown Transit Hub
    'place-8': { x: 38, y: 18 }, // University Quarter
    // Hazard coordinates
    'rep-1': { x: 60, y: 43 },
    'rep-2': { x: 70, y: 26 },
    'rep-3': { x: 40, y: 58 },
    'rep-4': { x: 47, y: 43 },
  };

  const placePins: MapPinItem[] = places.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.categoryLabel,
    x: pinCoordinates[p.id]?.x || 50,
    y: pinCoordinates[p.id]?.y || 50,
    type: 'place',
    placeData: p,
  }));

  const hazardPins: MapPinItem[] = safetyReports.map((r) => ({
    id: r.id,
    name: r.title,
    category: r.category,
    x: pinCoordinates[r.id]?.x || 55,
    y: pinCoordinates[r.id]?.y || 55,
    type: 'hazard',
    severity: r.severity,
    reportData: r,
  }));

  const visiblePins = [
    ...(activeFilter === 'all' || activeFilter === 'places' ? placePins : []),
    ...(activeFilter === 'all' || activeFilter === 'safety' ? hazardPins : []),
  ];

  const handleDetailsClick = (place: Place) => {
    if (onOpenDetails) {
      onOpenDetails(place);
    } else {
      setModalPlace(place);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Layers:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              All Layers ({visiblePins.length})
            </button>
            <button
              onClick={() => setActiveFilter('places')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'places'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Places ({placePins.length})
            </button>
            <button
              onClick={() => setActiveFilter('safety')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'safety'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Safety Advisories ({hazardPins.length})
            </button>
          </div>
        </div>

        {/* Route Guidance Simulator Pill */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowRouteGuidance(!showRouteGuidance)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showRouteGuidance
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Navigation size={13} className={showRouteGuidance ? 'text-emerald-400' : ''} />
            <span>{showRouteGuidance ? 'Hide Route Simulation' : 'Simulate Route Guidance'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Route Control Panel */}
      {showRouteGuidance && (
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Navigation size={15} />
              <span>Route Guidance Preview (DEMO Prototype)</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SIMULATED ADVISORY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Departure Point:</label>
              <select
                value={routeOrigin}
                onChange={(e) => setRouteOrigin(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.neighborhood})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Destination:</label>
              <select
                value={routeDest}
                onChange={(e) => setRouteDest(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.neighborhood})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Guidance Limitation:</strong> Suggested trajectory incorporates known citizen lighting and pavement hazard zones. <em>Routes are guidance only and are never guaranteed safe.</em> Always remain aware of real-world street conditions.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Map Visual Grid */}
      <div className="relative w-full h-[540px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
        {/* Background Grid Pattern & River Simulation */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* River curve */}
          <path
            d="M 200 0 C 350 200, 600 300, 950 600"
            fill="none"
            stroke="#0369a1"
            strokeWidth="32"
            strokeOpacity="0.35"
          />
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-6 left-8 text-[11px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
          Sector 1: University Quarter
        </div>
        <div className="absolute top-8 right-12 text-[11px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
          Sector 2: Old Citadel & Ramparts
        </div>
        <div className="absolute top-[42%] left-[38%] text-[11px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
          Sector 3: Downtown Hub
        </div>
        <div className="absolute bottom-8 right-16 text-[11px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
          Sector 4: Riverfront Greenways
        </div>

        {/* Route visualization line when enabled */}
        {showRouteGuidance && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <line
              x1={`${pinCoordinates[routeOrigin]?.x || 50}%`}
              y1={`${pinCoordinates[routeOrigin]?.y || 50}%`}
              x2={`${pinCoordinates[routeDest]?.x || 70}%`}
              y2={`${pinCoordinates[routeDest]?.y || 30}%`}
              stroke="#06d6a0"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Pins Rendering */}
        {visiblePins.map((pin) => {
          const isPlace = pin.type === 'place';
          const isSelected = selectedPin?.id === pin.id;

          return (
            <div
              key={pin.id}
              onClick={() => setSelectedPin(pin)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
            >
              {isPlace ? (
                /* Place Pin */
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-125 shadow-lg ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-500/40 scale-125'
                        : 'bg-slate-900 border-2 border-cyan-400 text-cyan-300'
                    }`}
                  >
                    <Compass size={16} />
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950/90 text-slate-200 border border-slate-700/80 whitespace-nowrap shadow-md">
                    {pin.name.slice(0, 16)}...
                  </span>
                </div>
              ) : (
                /* Hazard / Safety Report Pin */
                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
                    <div
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center shadow-lg ${
                        pin.severity === 'warning'
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      <AlertTriangle size={14} />
                    </div>
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950/90 text-rose-200 border border-rose-500/50 whitespace-nowrap shadow-md">
                    ⚠️ {pin.category}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Selected Location Details Overlay Drawer */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-900/95 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-30 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {selectedPin.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">
                  {selectedPin.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            {selectedPin.type === 'place' && selectedPin.placeData && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2">
                  {selectedPin.placeData.tagline}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Rating: ★ {selectedPin.placeData.rating}</span>
                  <span>Cost: {selectedPin.placeData.priceLevel}</span>
                  <span>Cleanliness: {selectedPin.placeData.cleanlinessScore}/10</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleDetailsClick(selectedPin.placeData!)}
                    className="flex-1 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs text-center transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => toggleSavePlace(selectedPin.placeData!.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs"
                    title="Save place"
                  >
                    <Bookmark
                      size={14}
                      className={isSaved(selectedPin.placeData.id) ? 'fill-cyan-400 text-cyan-400' : ''}
                    />
                  </button>
                  <button
                    onClick={() => toggleComparePlace(selectedPin.placeData!.id)}
                    className={`p-2 rounded-xl border text-xs ${
                      isCompared(selectedPin.placeData.id)
                        ? 'bg-teal-500 text-slate-950 border-teal-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                    title="Compare place"
                  >
                    <Scale size={14} />
                  </button>
                </div>
              </div>
            )}

            {selectedPin.type === 'hazard' && selectedPin.reportData && (
              <div className="space-y-2">
                <p className="text-xs text-slate-300">
                  {selectedPin.reportData.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{selectedPin.reportData.neighborhood}</span>
                  <span className="text-amber-400">{selectedPin.reportData.timestamp}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Place Pin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Citizen Hazard Report</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-400 border-dashed" />
            <span>Simulated Route</span>
          </div>
        </div>
      </div>

      {/* Place Details Modal fallback */}
      <PlaceDetailsModal place={modalPlace} onClose={() => setModalPlace(null)} />
    </div>
  );
}
