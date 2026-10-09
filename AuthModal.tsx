'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { UserProfile } from '@/types';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  User,
  Mail,
  Lock,
  Compass
} from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, user, login, logout, selectedCity } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Explorer');

  if (!authModalOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: name.trim() || (isRegister ? 'New Citizen' : 'Aaditya Explorer'),
      email: email.trim() || 'user@noproblem.ai',
      role,
      contributionsCount: isRegister ? 0 : 4,
    });
    setAuthModalOpen(false);
  };

  const handleQuickDemoLogin = (demoRole: UserProfile['role'], demoName: string) => {
    login({
      name: demoName,
      email: `${demoName.toLowerCase().replace(/\s+/g, '.')}@noproblem.ai`,
      role: demoRole,
      contributionsCount: demoRole === 'Verified Resident' ? 12 : 5,
    });
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full shadow-2xl p-6 text-slate-100 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-950/80 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {user ? 'Citizen Profile & Access' : isRegister ? 'Create Citizen Account' : 'Sign In to NoProblem AI'}
              </h3>
              <p className="text-[11px] text-emerald-300/80">
                Verified Smart City Identity for {selectedCity.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {user ? (
          /* Active User Profile View */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-900/60 flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                  <span>Role: {user.role}</span>
                  <span>•</span>
                  <span>{user.contributionsCount} Civic Contributions</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Explorer City:</span>
                <strong className="text-white">{selectedCity.name}, {selectedCity.state}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Session Status:</span>
                <span className="text-emerald-400 font-semibold">Live Prototype Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  logout();
                  setAuthModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="space-y-4">
            {/* Quick Demo Login Profiles */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick 1-Click Demo Profiles:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('Verified Resident', 'Pooja Deshmukh (Resident)')}
                  className="p-2 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-emerald-300">Verified Resident</div>
                  <div className="text-[10px] text-slate-400">Local Ward Reporter</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('City Guide', 'Rohan Kulkarni (Guide)')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-cyan-300">Local City Guide</div>
                  <div className="text-[10px] text-slate-400">Heritage Expert</div>
                </button>
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase font-semibold">Or enter credentials</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {isRegister && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Joshi"
                    className="w-full bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@noproblem.ai"
                  className="w-full bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-emerald-900/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {isRegister && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Select Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-emerald-900/60 rounded-xl p-2 text-white focus:border-emerald-500"
                  >
                    <option value="Explorer">🧭 Explorer / Traveler</option>
                    <option value="Resident">🏠 City Resident</option>
                    <option value="City Guide">🏛️ Local Heritage Guide</option>
                    <option value="Civic Volunteer">🛡️ Civic Safety Volunteer</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-mint-400 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer mt-2"
              >
                <span>{isRegister ? 'Create Citizen Account' : 'Sign In to Platform'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="text-center pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                {isRegister
                  ? 'Already have an account? Sign In here'
                  : "Don't have an account? Sign Up for Free"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
