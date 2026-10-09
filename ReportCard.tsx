'use client';

import React, { useState } from 'react';
import { CitizenSafetyReport } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  MapPin, 
  Clock, 
  Camera, 
  Mic, 
  ThumbsUp, 
  Play,
  Square,
  Volume2
} from 'lucide-react';

interface ReportCardProps {
  report: CitizenSafetyReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const { upvoteReport } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const severityConfigs = {
    warning: {
      border: 'border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-slate-900',
      badge: 'bg-rose-950/90 text-rose-300 border-rose-500/50',
      icon: <AlertTriangle size={15} className="text-rose-400 shrink-0" />,
      label: 'Warning',
    },
    caution: {
      border: 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-900',
      badge: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
      icon: <AlertCircle size={15} className="text-amber-400 shrink-0" />,
      label: 'Caution',
    },
    info: {
      border: 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-900',
      badge: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50',
      icon: <Info size={15} className="text-cyan-400 shrink-0" />,
      label: 'Info Advisory',
    },
  };

  const config = severityConfigs[report.severity] || severityConfigs.info;

  const handleTogglePlayAudio = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 4000);
    } else {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border ${config.border} shadow-xl space-y-3.5 transition-all hover:border-cyan-500/40`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badge}`}>
            {config.icon}
            <span>{report.category}</span>
          </span>

          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            DEMO
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock size={12} />
          <span>{report.timestamp}</span>
        </div>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
          {report.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          {report.description}
        </p>
      </div>

      {/* Voice note simulation player if present */}
      {report.hasVoiceNote && (
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <Volume2 size={15} className={isPlayingAudio ? 'animate-bounce text-cyan-400' : 'text-slate-400'} />
            <span className="font-semibold text-[11px]">
              {isPlayingAudio ? 'Playing citizen audio note (0:04)...' : 'Audio note recorded by resident (0:06)'}
            </span>
          </div>
          <button
            onClick={handleTogglePlayAudio}
            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 font-bold text-[11px] flex items-center gap-1 transition-all"
          >
            {isPlayingAudio ? <Square size={11} /> : <Play size={11} />}
            <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
          </button>
        </div>
      )}

      {/* Photo attachment toggle if present */}
      {report.hasPhoto && (
        <div>
          <button
            onClick={() => setShowPhotoPreview(!showPhotoPreview)}
            className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1"
          >
            <Camera size={12} />
            <span>{showPhotoPreview ? 'Hide Photo Attachment' : 'View Attached Observation Photo'}</span>
          </button>
          {showPhotoPreview && (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 max-w-sm">
              <img
                src={report.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=600&q=80'}
                alt="Civic report photo"
                className="w-full h-36 object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* Meta Footer */}
      <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="flex items-center gap-1 text-cyan-300 font-medium text-[11px]">
            <MapPin size={13} />
            <span>{report.location || report.neighborhood}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {report.verifiedStatus}
          </span>

          <button
            onClick={() => upvoteReport(report.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all shadow-sm"
            title="Upvote citizen advisory"
            aria-label="Upvote report"
          >
            <ThumbsUp size={12} className="text-cyan-400" />
            <span>{report.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
