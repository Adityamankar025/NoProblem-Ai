'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  MapPin, 
  Sparkles,
  Compass, 
  ShieldAlert, 
  Scale, 
  BookOpen, 
  Bot, 
  Bookmark, 
  Menu, 
  X,
  LayoutDashboard,
  Plus,
  ChevronDown,
  Flag,
  User,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import SubmitReportModal from '@/components/safety/SubmitReportModal';
import AuthModal from '@/components/common/AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    cities, 
    selectedCity, 
    setSelectedCityId, 
    savedPlaceIds, 
    comparePlaceIds,
    activeTab,
    setActiveTab,
    user,
    setAuthModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', tabKey: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/explore', tabKey: 'explore', label: 'Explore City', icon: Compass },
    { href: '/safety', tabKey: 'safety', label: 'Safety Intelligence', icon: ShieldAlert },
    { href: '/history', tabKey: 'history', label: 'History & Culture', icon: BookOpen },
    { 
      href: '/compare', 
      tabKey: 'compare', 
      label: 'Compare Places', 
      icon: Scale, 
      count: comparePlaceIds.length 
    },
    { href: '/reports', tabKey: 'reports', label: 'Citizen Reports', icon: Flag },
    { href: '/assistant', tabKey: 'assistant', label: 'Pro AI Assistant', icon: Bot },
    { 
      href: '/saved', 
      tabKey: 'saved', 
      label: 'Saved', 
      icon: Bookmark, 
      count: savedPlaceIds.length 
    },
  ];

  const isActive = (item: typeof navLinks[0]) => {
    if (pathname === '/') {
      return activeTab === item.tabKey;
    }
    return pathname.startsWith(item.href);
  };

  const handleNavClick = (item: typeof navLinks[0]) => {
    setActiveTab(item.tabKey);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-[29px] z-40 bg-slate-950/90 backdrop-blur-md border-b border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand Identity in Cyber Emerald */}
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg p-1"
              >
                {/* Map-pin + AI-inspired emblem */}
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-mint-400 p-0.5 shadow-lg shadow-emerald-950/60 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                    <MapPin className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
                    <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute top-1.5 right-1.5 animate-pulse" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    NoProblem <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">AI</span>
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold tracking-wide hidden sm:inline">
                    The City Is Complex. Exploring It Shouldn't Be.
                  </span>
                </div>
              </Link>

              {/* Multi-City Selector Pill */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-emerald-900/50 hover:border-emerald-500/50 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer"
                >
                  <MapPin size={13} className="text-emerald-400" />
                  <span>{selectedCity.name}, {selectedCity.state}</span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {cityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-emerald-900/60 rounded-2xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-400/90 border-b border-slate-800">
                      Switch Explorer City ({cities.length} Cities)
                    </div>
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCityId(city.id);
                          setCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-950/60 transition-colors ${
                          selectedCity.id === city.id ? 'text-emerald-300 font-bold bg-emerald-950/80' : 'text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white">{city.name}</div>
                          <div className="text-[10px] text-slate-400">{city.state}, {city.country}</div>
                        </div>
                        {selectedCity.id === city.id && (
                          <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: User Profile / Sign In & Report Issue */}
            <div className="flex items-center gap-2.5">
              {/* User Profile / Login Button */}
              {user ? (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-900 border border-emerald-900/60 hover:border-emerald-500/50 transition-all cursor-pointer"
                  title="View Profile"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-500/50"
                  />
                  <div className="hidden sm:block text-left text-[11px]">
                    <div className="font-bold text-white leading-tight truncate max-w-[90px]">{user.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-emerald-400 font-medium">{user.role}</div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 font-bold text-xs border border-emerald-900/60 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn size={13} />
                  <span>Sign In</span>
                </button>
              )}

              {/* Report Issue Button */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Report Issue</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-slate-950/95 border-b border-emerald-950 px-4 pt-3 pb-6 space-y-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            {/* Mobile City Selector */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-950">
              <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Select City ({cities.length} available)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCityId(city.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2 rounded-lg text-xs font-semibold text-left border ${
                      selectedCity.id === city.id
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div>{city.name}</div>
                    <div className="text-[10px] text-slate-500">{city.state}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation links grid */}
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium ${
                      active
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Global Modals */}
      <SubmitReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
      <AuthModal />
    </>
  );
}
