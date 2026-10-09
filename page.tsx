'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Place } from '@/types';
import LeafletMap from '@/components/map/LeafletMap';
import PlaceCard from '@/components/explore/PlaceCard';
import PlaceDetailsModal from '@/components/explore/PlaceDetailsModal';
import ReportCard from '@/components/safety/ReportCard';
import SubmitReportModal from '@/components/safety/SubmitReportModal';
import { 
  Compass, 
  ShieldAlert, 
  Scale, 
  Bookmark, 
  CloudSun, 
  Wind, 
  Sparkles, 
  Plus, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Building2,
  Utensils,
  Hotel,
  Coffee,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    places, 
    savedPlaceIds, 
    comparePlaceIds, 
    safetyReports, 
    selectedCity, 
    setSelectedCityId, 
    cities,
    searchQuery,
    setSearchQuery,
    setActiveTab
  } = useApp();

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const metrics = selectedCity.metrics;

  const categories = [
    { name: 'Heritage Sites', count: places.filter((p) => p.category === 'heritage').length, icon: Building2, catKey: 'heritage' },
    { name: 'Dining & Street Food', count: places.filter((p) => p.category === 'restaurant').length, icon: Utensils, catKey: 'restaurant' },
    { name: 'Parks & Forts', count: places.filter((p) => p.category === 'attraction').length, icon: Compass, catKey: 'attraction' },
    { name: 'Budget Cafes', count: places.filter((p) => p.category === 'budget').length, icon: Coffee, catKey: 'budget' },
    { name: 'Hotels', count: places.filter((p) => p.category === 'hotel').length, icon: Hotel, catKey: 'hotel' },
  ];

  const filteredPlaces = localSearch.trim()
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.neighborhood.toLowerCase().includes(localSearch.toLowerCase()) ||
          p.categoryLabel.toLowerCase().includes(localSearch.toLowerCase())
      )
    : places;

  return (
    <div className="space-y-10">
      {/* Welcome Banner & Search Header in Cyber Emerald */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-950 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
              <Sparkles size={13} className="text-emerald-400" />
              <span>The City Is Complex. Exploring It Shouldn't Be.</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore {selectedCity.name}, {selectedCity.state}
            </h1>
            <p className="text-sm sm:text-base text-emerald-300/90 mt-1 max-w-xl font-semibold">
              "The City Is Complex. Exploring It Shouldn't Be."
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedCity.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Report Issue</span>
            </button>

            <Link
              href="/assistant"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/40 flex items-center gap-1.5 transition-all"
            >
              <Sparkles size={14} className="text-emerald-400" />
              <span>Pro AI Assistant</span>
            </Link>
          </div>
        </div>

        {/* Search Bar with requested text */}
        <div className="relative max-w-2xl space-y-1.5">
          <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            <span>“Your next favorite place is just one search away.”</span>
          </label>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              placeholder="“Your next favorite place is just one search away.”"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full bg-slate-950/90 border border-emerald-900/60 rounded-2xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-white placeholder-emerald-400/60 focus:outline-none focus:border-emerald-400 shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/explore"
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cataloged Places</span>
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400">
              <Compass size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {places.length}
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">{selectedCity.name}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Verified with accessibility audits</span>
        </Link>

        <Link
          href="/safety"
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Safety Reports</span>
            <div className="p-2 rounded-xl bg-rose-950 text-rose-400">
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white group-hover:text-rose-300 transition-colors">
              {safetyReports.length}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">Community Feed</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Potholes, lighting & traffic</span>
        </Link>

        <Link
          href="/compare"
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Comparison Tray</span>
            <div className="p-2 rounded-xl bg-teal-950 text-teal-400">
              <Scale size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">
              {comparePlaceIds.length} / 4
            </span>
            <span className="text-[10px] text-teal-400 font-semibold">Selected</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Multi-criteria weighted matrix</span>
        </Link>

        <Link
          href="/saved"
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Saved Bookmarks</span>
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <Bookmark size={16} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {savedPlaceIds.length}
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">Bookmarked</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Saved for offline session</span>
        </Link>
      </div>

      {/* City Insights Panel (Weather, Traffic, Air Quality, Cleanliness) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {selectedCity.name} Live Smart City Insights & Conditions
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {metrics.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Weather */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-cyan-300">
              <span className="text-slate-400 font-medium">Weather & Temp</span>
              <CloudSun size={18} />
            </div>
            <div className="text-xl font-bold text-white">
              {metrics.temperatureC}°C
            </div>
            <p className="text-[11px] text-slate-300">{metrics.weatherSummary}</p>
            <div className="text-[10px] text-slate-400">Humidity: {metrics.humidityPercent || 54}%</div>
          </div>

          {/* Air Quality */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-teal-300">
              <span className="text-slate-400 font-medium">Air Quality (AQI)</span>
              <Wind size={18} />
            </div>
            <div className="text-xl font-bold text-teal-400">
              {metrics.airQualityIndex} AQI
            </div>
            <p className="text-[11px] text-slate-300">{metrics.airQualityLabel}</p>
            <div className="text-[10px] text-emerald-400 font-semibold">PMC Ambient Air Monitor</div>
          </div>

          {/* Traffic */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-amber-300">
              <span className="text-slate-400 font-medium">Traffic Conditions</span>
              <TrendingUp size={18} />
            </div>
            <div className="text-sm font-bold text-amber-300 line-clamp-1">
              Moderate Flow
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
              {metrics.trafficStatus}
            </p>
          </div>

          {/* Cleanliness & Roads */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-slate-400 font-medium">Cleanliness & Infra</span>
              <CheckCircle2 size={18} />
            </div>
            <div className="text-xl font-bold text-emerald-400">
              {metrics.cleanlinessScore} / 10
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              {metrics.roadConditions}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-cyan-400" size={20} />
              <span>Interactive {selectedCity.name} Geospatial Map</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              OpenStreetMap integration with category pins, popups, and community hazard alerts.
            </p>
          </div>
          <Link
            href="/map"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Full Map Screen</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <LeafletMap onSelectPlace={(p) => setSelectedPlace(p)} heightClass="h-[480px]" />
      </div>

      {/* Recommended Places Catalog */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white">Recommended Places in {selectedCity.name}</h3>
            <p className="text-xs text-slate-400">
              Curated heritage landmarks, street dining, parks, and budget spots with verified audits.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Browse All ({places.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaces.slice(0, 6).map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onOpenDetails={(p) => setSelectedPlace(p)}
            />
          ))}
        </div>
      </div>

      {/* Recent Citizen Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="text-rose-400" size={20} />
              <span>Recent Citizen Safety & Civic Reports</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live resident reports in {selectedCity.name} for situational awareness.
            </p>
          </div>
          <Link
            href="/reports"
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
          >
            <span>View All Reports</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safetyReports.slice(0, 4).map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>

      {/* Place Details Modal if opened */}
      {selectedPlace && (
        <PlaceDetailsModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* Report Modal */}
      <SubmitReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
