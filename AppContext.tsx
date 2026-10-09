'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Place, CitizenSafetyReport, CityConfig, ReportCategory, SafetySeverity, UserProfile } from '@/types';
import { CITIES, DEMO_PLACES, DEMO_SAFETY_REPORTS } from '@/data/demoData';

interface ToastNotice {
  id: string;
  type: 'success' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  cities: CityConfig[];
  selectedCity: CityConfig;
  setSelectedCityId: (id: string) => void;
  places: Place[];
  allPlaces: Place[];
  savedPlaceIds: string[];
  comparePlaceIds: string[];
  safetyReports: CitizenSafetyReport[];
  toast: ToastNotice | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterCategory: string;
  setFilterCategory: (cat: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  login: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  toggleSavePlace: (id: string) => void;
  isSaved: (id: string) => boolean;
  toggleComparePlace: (id: string) => void;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;
  addCitizenReport: (report: {
    title: string;
    category: ReportCategory;
    description: string;
    neighborhood: string;
    location?: string;
    severity: SafetySeverity;
    hasPhoto?: boolean;
    photoUrl?: string;
    hasVoiceNote?: boolean;
  }) => void;
  upvoteReport: (id: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cities] = useState<CityConfig[]>(CITIES);
  const [selectedCityId, setSelectedCityIdState] = useState<string>('pune');
  const [allPlaces] = useState<Place[]>(DEMO_PLACES);
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(['pune-1', 'pune-2', 'pune-4']);
  const [comparePlaceIds, setComparePlaceIds] = useState<string[]>(['pune-1', 'pune-2']);
  const [safetyReports, setSafetyReports] = useState<CitizenSafetyReport[]>(DEMO_SAFETY_REPORTS);
  const [toast, setToast] = useState<ToastNotice | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Authenticated user state
  const [user, setUser] = useState<UserProfile | null>({
    id: 'user-demo-1',
    name: 'Aaditya Sharma',
    email: 'aaditya.explorer@noproblem.ai',
    role: 'Explorer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    contributionsCount: 3,
  });

  const selectedCity = cities.find((c) => c.id === selectedCityId) || cities[0];
  const places = allPlaces.filter((p) => !p.cityId || p.cityId === selectedCityId);

  // Load from localStorage on client mount if available
  useEffect(() => {
    try {
      const storedCity = localStorage.getItem('noproblem_city');
      if (storedCity && CITIES.some((c) => c.id === storedCity)) {
        setSelectedCityIdState(storedCity);
      }
      const storedSaved = localStorage.getItem('noproblem_saved_places');
      if (storedSaved) {
        setSavedPlaceIds(JSON.parse(storedSaved));
      }
      const storedCompare = localStorage.getItem('noproblem_compare_places');
      if (storedCompare) {
        setComparePlaceIds(JSON.parse(storedCompare));
      }
      const storedReports = localStorage.getItem('noproblem_citizen_reports');
      if (storedReports) {
        setSafetyReports(JSON.parse(storedReports));
      }
      const storedUser = localStorage.getItem('noproblem_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const login = (profile: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: profile.id || `usr-${Date.now()}`,
      name: profile.name || 'Aditya Explorer',
      email: profile.email || 'aditya@example.com',
      role: profile.role || 'Explorer',
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      contributionsCount: profile.contributionsCount || 1,
    };
    setUser(newUser);
    try {
      localStorage.setItem('noproblem_user', JSON.stringify(newUser));
    } catch {}
    showToast(`Welcome back, ${newUser.name}! Signed in as ${newUser.role}`, 'success');
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('noproblem_user');
    } catch {}
    showToast('Signed out of NoProblem AI session', 'info');
  };

  const setSelectedCityId = (id: string) => {
    setSelectedCityIdState(id);
    const target = cities.find((c) => c.id === id);
    if (target) {
      showToast(`Switched explorer city to ${target.name}, ${target.state}`, 'info');
    }
    try {
      localStorage.setItem('noproblem_city', id);
    } catch {}
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3800);
  };

  const dismissToast = () => setToast(null);

  const toggleSavePlace = (id: string) => {
    setSavedPlaceIds((prev) => {
      let updated: string[];
      const place = allPlaces.find((p) => p.id === id);
      const name = place ? place.name : 'Place';
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
        showToast(`Removed "${name}" from Saved Places`, 'info');
      } else {
        updated = [...prev, id];
        showToast(`Saved "${name}" to favorites`, 'success');
      }
      try {
        localStorage.setItem('noproblem_saved_places', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isSaved = (id: string) => savedPlaceIds.includes(id);

  const toggleComparePlace = (id: string) => {
    setComparePlaceIds((prev) => {
      let updated: string[];
      const place = allPlaces.find((p) => p.id === id);
      const name = place ? place.name : 'Place';
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
        showToast(`Removed "${name}" from comparison`, 'info');
      } else {
        if (prev.length >= 4) {
          showToast('You can compare a maximum of 4 places at a time.', 'warning');
          return prev;
        }
        updated = [...prev, id];
        showToast(`Added "${name}" to Compare Places`, 'success');
      }
      try {
        localStorage.setItem('noproblem_compare_places', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isCompared = (id: string) => comparePlaceIds.includes(id);

  const clearCompare = () => {
    setComparePlaceIds([]);
    try {
      localStorage.removeItem('noproblem_compare_places');
    } catch {}
    showToast('Comparison list cleared', 'info');
  };

  const addCitizenReport = (report: {
    title: string;
    category: ReportCategory;
    description: string;
    neighborhood: string;
    location?: string;
    severity: SafetySeverity;
    hasPhoto?: boolean;
    photoUrl?: string;
    hasVoiceNote?: boolean;
  }) => {
    const newReport: CitizenSafetyReport = {
      id: `rep-${Date.now()}`,
      cityId: selectedCityId,
      title: report.title,
      category: report.category,
      description: report.description,
      neighborhood: report.neighborhood,
      location: report.location,
      severity: report.severity,
      timestamp: 'Just now (Live Feed)',
      verifiedStatus: user ? 'Community Reported (DEMO)' : 'Under Review (DEMO)',
      hasPhoto: report.hasPhoto ?? false,
      photoUrl: report.photoUrl,
      hasVoiceNote: report.hasVoiceNote ?? false,
      upvotes: 1,
      isDemo: true,
    };

    setSafetyReports((prev) => {
      const updated = [newReport, ...prev];
      try {
        localStorage.setItem('noproblem_citizen_reports', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (user) {
      setUser((prev) => prev ? { ...prev, contributionsCount: prev.contributionsCount + 1 } : prev);
    }

    showToast('Citizen report published to live community board!', 'success');
  };

  const upvoteReport = (id: string) => {
    setSafetyReports((prev) => {
      const updated = prev.map((rep) =>
        rep.id === id ? { ...rep, upvotes: rep.upvotes + 1 } : rep
      );
      try {
        localStorage.setItem('noproblem_citizen_reports', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('Observation upvoted (+1 verification impact)', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        cities,
        selectedCity,
        setSelectedCityId,
        places,
        allPlaces,
        savedPlaceIds,
        comparePlaceIds,
        safetyReports,
        toast,
        searchQuery,
        setSearchQuery,
        filterCategory,
        setFilterCategory,
        activeTab,
        setActiveTab,
        user,
        login,
        logout,
        authModalOpen,
        setAuthModalOpen,
        toggleSavePlace,
        isSaved,
        toggleComparePlace,
        isCompared,
        clearCompare,
        addCitizenReport,
        upvoteReport,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
