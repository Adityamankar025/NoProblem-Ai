import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import DemoBanner from '@/components/common/DemoBanner';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Toast from '@/components/common/Toast';

export const metadata: Metadata = {
  title: 'NoProblem AI — Explore Smarter. Travel Safer. Live Better.',
  description: 'Smart city exploration platform that transforms city information into actionable recommendations, heritage culture, and ethical safety guidance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-950 text-slate-100">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        <AppProvider>
          <DemoBanner />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
