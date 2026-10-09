'use client';

import React from 'react';
import { Place } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Accessibility, 
  Sparkles, 
  Bookmark, 
  Scale, 
  Check, 
  Info,
  Building2,
  AlertCircle
} from 'lucide-react';

interface PlaceDetailsModalProps {
  place: Place | null;
  onClose: () => void;
}

export default function PlaceDetailsModal({ place, onClose }: PlaceDetailsModalProps) {
  const { toggleSavePlace, isSaved, toggleComparePlace, isCompared } = useApp();

  if (!place) return null;

  const saved = isSaved(place.id);
  const compared = isCompared(place.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden relative text-slate-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-modal-title"
      >
        {/* Header Image & Close */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-800 shrink-0">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-950/70 hover:bg-slate-950 text-slate-200 hover:text-white p-2 rounded-full backdrop-blur-md border border-slate-700/60 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
              {place.categoryLabel}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
              DEMO DATA
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h2 id="place-modal-title" className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {place.name}
            </h2>
            <div className="flex items-center gap-2 text-cyan-300 text-xs mt-1">
              <MapPin size={14} className="shrink-0" />
              <span>{place.address} ({place.neighborhood})</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Demo Rating</span>
              <span className="text-lg font-bold text-cyan-300">★ {place.rating.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 block">({place.reviewCount} reviews)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Estimated Cost</span>
              <span className="text-lg font-bold text-emerald-300">{place.priceLevel} (~${place.estimatedCostUSD})</span>
              <span className="text-[10px] text-slate-400 block">per person</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Cleanliness Index</span>
              <span className="text-lg font-bold text-teal-300">{place.cleanlinessScore}/10</span>
              <span className="text-[10px] text-slate-400 block">Sample metric</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Affordability</span>
              <span className="text-lg font-bold text-blue-300">{place.affordabilityScore}/10</span>
              <span className="text-[10px] text-slate-400 block">Budget index</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{place.description}</p>
          </div>

          {/* Operating Hours & Transit */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 font-medium">Operating Hours: </span>
              <span className="text-slate-200 font-semibold">{place.operatingHours}</span>
            </div>
          </div>

          {/* Accessibility Breakdown */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-cyan-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">Accessibility Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${place.accessibility.wheelchairAccessible ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span className="text-slate-300">Wheelchair Accessible: <strong>{place.accessibility.wheelchairAccessible ? 'Yes' : 'No / Limited'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${place.accessibility.stepFreeAccess ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                <span className="text-slate-300">Step-free Access: <strong>{place.accessibility.stepFreeAccess ? 'Yes' : 'Stairs present'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${place.accessibility.brailleOrAudioGuide ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className="text-slate-300">Audio/Braille Guide: <strong>{place.accessibility.brailleOrAudioGuide ? 'Available' : 'None'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${place.accessibility.accessibleRestroom ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span className="text-slate-300">Accessible Restroom: <strong>{place.accessibility.accessibleRestroom ? 'Yes' : 'Standard only'}</strong></span>
              </div>
            </div>
            <p className="text-xs text-slate-300 border-t border-slate-700/60 pt-2 italic">
              Note: {place.accessibility.notes}
            </p>
          </div>

          {/* Safety Guidance Notes (No guaranteed safety claims) */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
              <h4 className="text-sm font-semibold">Sourced Safety Guidance (Advisory Only)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {place.safetyGuidanceNotes}
            </p>
            <p className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2 flex items-center gap-1.5">
              <AlertCircle size={12} className="text-amber-400 shrink-0" />
              <span>Limitation: Provided for situational awareness. No route or location is guaranteed 100% safe.</span>
            </p>
          </div>

          {/* History / Culture if available */}
          {(place.historicalEra || place.culturalSignificance) && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300">
                <Building2 className="w-4 h-4" />
                <h4 className="text-sm font-semibold">History & Cultural Context</h4>
              </div>
              {place.historicalEra && (
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Era: </span>
                  <strong>{place.historicalEra}</strong>
                </div>
              )}
              {place.culturalSignificance && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {place.culturalSignificance}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavePlace(place.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                saved
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Bookmark size={15} className={saved ? 'fill-slate-950' : ''} />
              <span>{saved ? 'Saved' : 'Save Place'}</span>
            </button>

            <button
              onClick={() => toggleComparePlace(place.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                compared
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Scale size={15} />
              <span>{compared ? 'In Comparison' : 'Compare'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
