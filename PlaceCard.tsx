'use client';

import React from 'react';
import { Place } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  MapPin, 
  Bookmark, 
  Scale, 
  Accessibility, 
  Eye, 
  Star,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onOpenDetails: (place: Place) => void;
}

export default function PlaceCard({ place, onOpenDetails }: PlaceCardProps) {
  const { toggleSavePlace, isSaved, toggleComparePlace, isCompared } = useApp();
  const saved = isSaved(place.id);
  const compared = isCompared(place.id);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Top Image & Category Badges */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
            {place.categoryLabel}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            DEMO
          </span>
        </div>

        {/* Quick Save Bookmark in Header */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSavePlace(place.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            saved 
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40' 
              : 'bg-slate-900/70 hover:bg-slate-900 text-slate-200 border border-slate-700/60'
          }`}
          title={saved ? 'Remove from Saved' : 'Save Place'}
          aria-label="Bookmark place"
        >
          <Bookmark size={15} className={saved ? 'fill-slate-950' : ''} />
        </button>

        {/* Price & Rating Bar */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-300 font-bold bg-slate-950/70 px-2 py-0.5 rounded-lg border border-slate-700/50 backdrop-blur-sm">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{place.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({place.reviewCount})</span>
          </div>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-500/30 backdrop-blur-sm">
            {place.priceLevel} (~${place.estimatedCostUSD})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400/90 text-[11px] font-medium mb-1">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{place.neighborhood}</span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {place.name}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {place.tagline}
          </p>
        </div>

        {/* Feature Badges */}
        <div className="space-y-2 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Accessibility size={13} className={place.accessibility.wheelchairAccessible ? 'text-teal-400' : 'text-slate-500'} />
              <span className="truncate">
                {place.accessibility.wheelchairAccessible ? 'Wheelchair Ready' : 'Stairs Required'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <span>Clean:</span>
              <strong className="text-cyan-300">{place.cleanlinessScore}/10</strong>
            </div>
          </div>

          {/* Sourced Guidance Pill */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-300">
            <ShieldAlert size={12} className="text-cyan-400 shrink-0" />
            <span className="truncate">Guidance: {place.safetyGuidanceNotes.slice(0, 42)}...</span>
          </div>
        </div>

        {/* Actions Bottom Bar */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onOpenDetails(place)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 transition-all"
          >
            <Eye size={13} />
            <span>Details</span>
          </button>

          <button
            onClick={() => toggleComparePlace(place.id)}
            className={`p-2 rounded-xl text-xs font-medium border transition-all ${
              compared
                ? 'bg-teal-500 text-slate-950 border-teal-400 font-semibold'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title={compared ? 'In comparison' : 'Add to compare'}
            aria-label="Add to comparison"
          >
            <Scale size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
