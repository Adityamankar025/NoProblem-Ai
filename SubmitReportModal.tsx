'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ReportCategory, SafetySeverity } from '@/types';
import { 
  X, 
  ShieldAlert, 
  Camera, 
  Mic, 
  MicOff,
  CheckCircle2, 
  AlertTriangle,
  Info,
  MapPin,
  UploadCloud
} from 'lucide-react';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitReportModal({ isOpen, onClose }: SubmitReportModalProps) {
  const { addCitizenReport, selectedCity } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Road damage');
  const [neighborhood, setNeighborhood] = useState(
    selectedCity.id === 'pune' ? 'FC Road Deccan' : 'Central District'
  );
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState<SafetySeverity>('caution');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories: { id: ReportCategory; label: string; icon: string }[] = [
    { id: 'Road damage', label: 'Road damage / Pothole', icon: '🚧' },
    { id: 'Traffic issue', label: 'Traffic issue / Congestion', icon: '🚦' },
    { id: 'Cleanliness', label: 'Cleanliness / Garbage', icon: '🧹' },
    { id: 'Safety concern', label: 'Safety concern / Dim Lighting', icon: '💡' },
    { id: 'Accessibility issue', label: 'Accessibility / Pavement Barrier', icon: '♿' },
    { id: 'Other civic issue', label: 'Other civic issue', icon: '⚠️' },
  ];

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceSeconds(1);
      const interval = setInterval(() => {
        setVoiceSeconds((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            setIsRecording(false);
            setHasVoiceNote(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setHasVoiceNote(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addCitizenReport({
        title: title.trim(),
        category,
        neighborhood,
        location: location.trim() || `${neighborhood}, ${selectedCity.name}`,
        severity,
        description: description.trim(),
        hasPhoto,
        photoUrl: hasPhoto
          ? 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=600&q=80'
          : undefined,
        hasVoiceNote,
      });
      setIsSubmitting(false);
      onClose();
      // Reset
      setTitle('');
      setDescription('');
      setLocation('');
      setHasPhoto(false);
      setHasVoiceNote(false);
      setVoiceSeconds(0);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl p-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-report-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-md shadow-rose-950/50">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 id="submit-report-title" className="text-base font-bold text-white">
                Submit Citizen Safety / Civic Report
              </h3>
              <p className="text-xs text-slate-400">
                Live Community Observation for {selectedCity.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close form"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Category Selector */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Civic Category *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition-all ${
                    category === c.id
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Report Title / Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep pothole causing skids near Goodluck Chowk"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Neighborhood & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Neighborhood / Ward *
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Shivajinagar, Kothrud"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Specific Landmark / Crossroad
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Near Gate 3 opposite metro stair"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Severity Radio */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Advisory Severity Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs cursor-pointer font-bold ${
                  severity === 'info'
                    ? 'bg-blue-950/70 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  className="sr-only"
                  checked={severity === 'info'}
                  onChange={() => setSeverity('info')}
                />
                <Info size={13} className="text-blue-400" />
                <span>Info / Advisory</span>
              </label>

              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs cursor-pointer font-bold ${
                  severity === 'caution'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  className="sr-only"
                  checked={severity === 'caution'}
                  onChange={() => setSeverity('caution')}
                />
                <AlertTriangle size={13} className="text-amber-400" />
                <span>Caution</span>
              </label>

              <label
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs cursor-pointer font-bold ${
                  severity === 'warning'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  className="sr-only"
                  checked={severity === 'warning'}
                  onChange={() => setSeverity('warning')}
                />
                <ShieldAlert size={13} className="text-rose-400" />
                <span>Warning</span>
              </label>
            </div>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Detailed Observation Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the condition, dimensions, time noticed, and pedestrian impact..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Attachments: Photo and Voice Note */}
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Optional Verification Attachments
            </span>
            <div className="flex flex-wrap items-center gap-3">
              {/* Photo toggle button */}
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  hasPhoto
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Camera size={14} className={hasPhoto ? 'text-cyan-400' : ''} />
                <span>{hasPhoto ? 'Photo Attached ✓' : 'Attach Photo'}</span>
              </button>

              {/* Voice note recorder button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                    : hasVoiceNote
                    ? 'bg-teal-950 border-teal-500 text-teal-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff size={14} className="text-rose-400" /> : <Mic size={14} />}
                <span>
                  {isRecording
                    ? `Recording (${voiceSeconds}s)...`
                    : hasVoiceNote
                    ? 'Voice Note Ready (0:06) ✓'
                    : 'Record Voice Note'}
                </span>
              </button>
            </div>
          </div>

          {/* Notice Disclaimer */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <p>
              <strong className="text-white">Transparency Policy:</strong> All community reports are tagged as <em>User-Submitted & Unverified</em> until evaluated. Do not submit sensitive personal identifiers.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition-all disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              <span>{isSubmitting ? 'Submitting...' : 'Post Citizen Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
