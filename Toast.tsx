'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-teal-500/40 bg-slate-900/95 text-slate-100',
    warning: 'border-amber-500/40 bg-slate-900/95 text-slate-100',
    info: 'border-cyan-500/40 bg-slate-900/95 text-slate-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md max-w-md ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <span className="text-sm font-medium leading-snug">{toast.message}</span>
        <button
          onClick={dismissToast}
          className="ml-2 text-slate-400 hover:text-white p-1 rounded transition-colors"
          aria-label="Dismiss toast"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
