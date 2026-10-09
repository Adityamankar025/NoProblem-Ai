'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Place } from '@/types';
import { 
  X, 
  Plus, 
  Scale, 
  Star, 
  Sparkles, 
  Accessibility, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Check, 
  AlertCircle,
  Bookmark,
  Sliders,
  Award,
  TrendingUp,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function ComparisonMatrix() {
  const { places, comparePlaceIds, toggleComparePlace, clearCompare, toggleSavePlace, isSaved, selectedCity } = useApp();

  // Weights for personalized smart ranking (sum to 100%)
  const [weights, setWeights] = useState({
    safety: 35,
    affordability: 25,
    cleanliness: 25,
    accessibility: 15,
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const comparedPlaces = places.filter((p) => comparePlaceIds.includes(p.id));
  const availableToAdd = places
    .filter((p) => !comparePlaceIds.includes(p.id))
    .filter((p) => filterCategory === 'all' || p.category === filterCategory);

  // Compute weighted score for each compared place
  const calculateScore = (p: Place) => {
    const safetyVal = p.safetyScore || 8.5;
    const cleanVal = p.cleanlinessScore;
    const affordVal = p.affordabilityScore;
    const accessVal = (p.accessibility.wheelchairAccessible ? 10 : 4) * 0.5 + 
                      (p.accessibility.stepFreeAccess ? 10 : 3) * 0.5;

    const weighted = (
      (safetyVal * weights.safety) +
      (cleanVal * weights.cleanliness) +
      (affordVal * weights.affordability) +
      (accessVal * weights.accessibility)
    ) / 100;

    return Number(weighted.toFixed(1));
  };

  const rankedPlaces = [...comparedPlaces].sort((a, b) => calculateScore(b) - calculateScore(a));
  const topRecommended = rankedPlaces[0];

  if (comparedPlaces.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-900/60 border border-slate-800 rounded-3xl max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-teal-400">
          <Scale size={32} />
        </div>
        <h3 className="text-xl font-bold text-white">No Places in Comparison</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Select 2 or more places from {selectedCity.name} to benchmark safety guidance, affordability, accessibility, and cleanliness.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-2">
          {places.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => toggleComparePlace(p.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 transition-colors"
            >
              <Plus size={13} />
              <span>Add {p.name.slice(0, 20)}...</span>
            </button>
          ))}
        </div>
        <div className="pt-4">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
          >
            Browse Exploration Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header & Quick Add */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-teal-400" />
          <span className="text-sm font-bold text-white">
            Comparing {comparedPlaces.length} Location{comparedPlaces.length > 1 ? 's' : ''} in {selectedCity.name}
          </span>
          <span className="text-xs text-slate-400">
            (Max 4 supported)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {availableToAdd.length > 0 && comparedPlaces.length < 4 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  toggleComparePlace(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="" disabled>+ Add another place to compare...</option>
              {availableToAdd.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.categoryLabel})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded-lg"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Weighted Priority Customizer Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Configurable Weighted Decision Weights
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Simulated evaluation algorithm
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Safety Weight:</span>
              <strong className="text-rose-400">{weights.safety}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.safety}
              onChange={(e) => setWeights({ ...weights, safety: Number(e.target.value) })}
              className="w-full accent-rose-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Affordability Weight:</span>
              <strong className="text-emerald-400">{weights.affordability}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.affordability}
              onChange={(e) => setWeights({ ...weights, affordability: Number(e.target.value) })}
              className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Cleanliness Weight:</span>
              <strong className="text-teal-400">{weights.cleanliness}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.cleanliness}
              onChange={(e) => setWeights({ ...weights, cleanliness: Number(e.target.value) })}
              className="w-full accent-teal-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Accessibility Weight:</span>
              <strong className="text-cyan-400">{weights.accessibility}%</strong>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.accessibility}
              onChange={(e) => setWeights({ ...weights, accessibility: Number(e.target.value) })}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* AI Recommendation Summary Box */}
      {topRecommended && comparedPlaces.length > 1 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/40 border border-teal-500/40 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-teal-400">
            <Award size={18} />
            <h4 className="text-sm font-bold text-white">
              AI Decision Recommendation: <span className="text-teal-300">{topRecommended.name}</span>
            </h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Based on your custom weights, <strong>{topRecommended.name}</strong> achieves the top composite score of <strong>{calculateScore(topRecommended)}/10</strong>.
            {topRecommended.accessibility.wheelchairAccessible
              ? ' It stands out with full step-free accessibility and high cleanliness ratings.'
              : ' While certain historical steps exist, it provides exceptional cultural immersion and affordability.'}
            {topRecommended.priceLevel === '$' && ' It is also highly budget-friendly for casual exploration.'}
          </p>
        </div>
      )}

      {/* Comparison Grid Cards */}
      <div className="overflow-x-auto pb-4">
        <div className={`grid gap-4 min-w-[700px] ${
          comparedPlaces.length === 1 ? 'grid-cols-1 max-w-md' :
          comparedPlaces.length === 2 ? 'grid-cols-2' :
          comparedPlaces.length === 3 ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {comparedPlaces.map((place) => {
            const saved = isSaved(place.id);
            const score = calculateScore(place);
            const isWinner = topRecommended && topRecommended.id === place.id && comparedPlaces.length > 1;

            return (
              <div
                key={place.id}
                className={`bg-slate-900/90 rounded-2xl overflow-hidden flex flex-col shadow-xl transition-all border ${
                  isWinner ? 'border-teal-500/60 ring-1 ring-teal-500/40' : 'border-slate-800'
                }`}
              >
                {/* Header Image */}
                <div className="relative h-44 bg-slate-800">
                  <img
                    src={place.imageUrl}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  {isWinner && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500 text-slate-950 shadow-md flex items-center gap-1">
                      <Award size={12} />
                      <span>TOP MATCH</span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleComparePlace(place.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-slate-950/70 hover:bg-slate-950 text-slate-300 hover:text-white border border-slate-700"
                    title="Remove from comparison"
                  >
                    <X size={14} />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
                      {place.categoryLabel}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
                      {place.name}
                    </h4>
                    <p className="text-[11px] text-cyan-400 truncate">
                      📍 {place.neighborhood}
                    </p>
                  </div>
                </div>

                {/* Score & Metrics Breakdown */}
                <div className="p-4 flex-1 space-y-4 text-xs divide-y divide-slate-800/80">
                  {/* Weighted Composite Score Banner */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Composite Score</span>
                      <span className="text-xs text-teal-400 font-semibold">Custom Weighted</span>
                    </div>
                    <span className="text-xl font-extrabold text-white">
                      {score} <span className="text-xs text-slate-400 font-normal">/ 10</span>
                    </span>
                  </div>

                  {/* Rating & Price */}
                  <div className="grid grid-cols-2 gap-2 pt-3 text-center">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Demo Rating</span>
                      <span className="font-bold text-amber-300 text-sm">★ {place.rating}</span>
                      <span className="text-[10px] text-slate-400 block">({place.reviewCount})</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Cost</span>
                      <span className="font-bold text-emerald-300 text-sm">{place.priceLevel}</span>
                      <span className="text-[10px] text-slate-400 block">~₹{place.estimatedCostINR || 50}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bars for Cleanliness, Affordability, Safety */}
                  <div className="pt-3 space-y-2.5">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Safety Index:</span>
                        <strong className="text-rose-400">{place.safetyScore || 8.5}/10</strong>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-rose-400 rounded-full"
                          style={{ width: `${(place.safetyScore || 8.5) * 10}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Cleanliness Index:</span>
                        <strong className="text-teal-300">{place.cleanlinessScore}/10</strong>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                          style={{ width: `${place.cleanlinessScore * 10}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Affordability Index:</span>
                        <strong className="text-emerald-300">{place.affordabilityScore}/10</strong>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${place.affordabilityScore * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Accessibility Audit */}
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[11px]">
                      <Accessibility size={13} />
                      <span>Accessibility Audit</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px]">
                      <li className="flex items-center justify-between">
                        <span className="text-slate-400">Wheelchair:</span>
                        <span className={`font-semibold ${place.accessibility.wheelchairAccessible ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {place.accessibility.wheelchairAccessible ? '✓ Supported' : '✕ Partial / Steps'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-slate-400">Step-free Paths:</span>
                        <span className={`font-semibold ${place.accessibility.stepFreeAccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {place.accessibility.stepFreeAccess ? '✓ Yes' : '✕ Stairs present'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-slate-400">Accessible Restroom:</span>
                        <span className="text-slate-300">
                          {place.accessibility.accessibleRestroom ? 'Available' : 'Standard'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Sourced Safety Guidance */}
                  <div className="pt-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
                      <ShieldAlert size={13} />
                      <span>Sourced Safety Notes</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                      {place.safetyGuidanceNotes}
                    </p>
                  </div>

                  {/* Operating Hours */}
                  <div className="pt-3 flex items-center gap-2 text-[11px] text-slate-300">
                    <Clock size={13} className="text-cyan-400 shrink-0" />
                    <span className="truncate">{place.operatingHours}</span>
                  </div>

                  {/* Action Bookmark */}
                  <div className="pt-3">
                    <button
                      onClick={() => toggleSavePlace(place.id)}
                      className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        saved
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <Bookmark size={13} className={saved ? 'fill-slate-950' : ''} />
                      <span>{saved ? 'Saved in Session' : 'Save Place'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
