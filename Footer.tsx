import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, ExternalLink, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-wide">
                NoProblem <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-slate-300 max-w-md text-xs leading-relaxed font-medium">
              "Explore Smarter. Travel Safer. Live Better."
            </p>
            <p className="text-slate-400 max-w-md text-xs leading-relaxed">
              Smart city exploration platform that transforms city information into useful recommendations, cultural history, and safety guidance for tourists, students, and citizens.
            </p>
            <div className="flex items-center gap-2 text-cyan-400/90 pt-1 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ethical City AI • OpenStreetMap Supported • Community Reported</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Platform Sections</h4>
            <ul className="space-y-1.5">
              <li><Link href="/dashboard" className="hover:text-cyan-300 transition-colors">Overview Dashboard</Link></li>
              <li><Link href="/explore" className="hover:text-cyan-300 transition-colors">Explore City & Map</Link></li>
              <li><Link href="/safety" className="hover:text-cyan-300 transition-colors">Safety Intelligence</Link></li>
              <li><Link href="/history" className="hover:text-cyan-300 transition-colors">History & Culture</Link></li>
              <li><Link href="/compare" className="hover:text-cyan-300 transition-colors">Compare Places</Link></li>
              <li><Link href="/reports" className="hover:text-cyan-300 transition-colors">Citizen Reports</Link></li>
            </ul>
          </div>

          {/* Assistant & Tech */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">AI & Transparency</h4>
            <ul className="space-y-1.5">
              <li><Link href="/assistant" className="hover:text-cyan-300 transition-colors">NoProblem AI Assistant</Link></li>
              <li><Link href="/map" className="hover:text-cyan-300 transition-colors">Geospatial Explorer</Link></li>
              <li><Link href="/saved" className="hover:text-cyan-300 transition-colors">Saved Places</Link></li>
              <li>
                <a 
                  href="https://www.openstreetmap.org/copyright" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
                >
                  <span>OpenStreetMap Data</span>
                  <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="max-w-2xl text-left">
            <p className="leading-relaxed">
              <strong className="text-slate-300">Safety Notice:</strong> Safety advisories, route indications, and reports are citizen observations for situational awareness. No route is guaranteed 100% safe. In urgent situations, call official city emergency numbers (112 in India).
            </p>
          </div>
          <div className="shrink-0 text-slate-400 text-right">
            <span>NoProblem AI • Hackathon MVP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
