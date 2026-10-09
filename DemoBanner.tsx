'use client';

import React, { useState } from 'react';
import { AlertCircle, X, Info } from 'lucide-react';

export default function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900/95 to-teal-950/90 border-b border-cyan-500/20 text-xs text-slate-300 py-1.5 px-4 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="font-semibold text-cyan-300 uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-600/40 shrink-0">
            Phase 1 Prototype (DEMO)
          </span>
          <p className="truncate text-slate-300">
            <strong className="text-white">Notice:</strong> Sample dataset active. Routes and safety observations are guidance only and not verified emergency data.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            title="Dismiss notice"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
