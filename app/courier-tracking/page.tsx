// @ts-nocheck
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CourierTrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    
    setIsSearching(true);
    // TODO: We will connect this to a Live API in the next step
    setTimeout(() => {
      setIsSearching(false);
      alert("API Connection Pending: Ready to track ID " + trackingId);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-orange-500/10 rounded-2xl mb-2">
          <span className="text-6xl drop-shadow-md">📦</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Live Courier <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Tracking</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Track your parcels across BlueDart, DTDC, India Post, Delhivery, and 50+ other courier services instantly.
        </p>
      </div>

      {/* Main Search Box */}
      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-orange-500 rounded-xl text-white text-lg placeholder-slate-500 outline-none transition-all shadow-inner"
                placeholder="Enter Tracking Number (AWB)..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 ${isSearching ? 'animate-pulse' : 'hover:-translate-y-1'}`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Tracking...
                </>
              ) : (
                'Track Now'
              )}
            </button>
          </div>
        </form>

        {/* Supported Couriers Logos (Text-based for now) */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-sm text-slate-500 font-semibold mb-4 text-center">SUPPORTED COURIERS</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-600">
            <span className="bg-slate-800/50 px-3 py-1 rounded-md">INDIA POST</span>
            <span className="bg-slate-800/50 px-3 py-1 rounded-md">BLUEDART</span>
            <span className="bg-slate-800/50 px-3 py-1 rounded-md">DTDC</span>
            <span className="bg-slate-800/50 px-3 py-1 rounded-md">DELHIVERY</span>
            <span className="bg-slate-800/50 px-3 py-1 rounded-md">ECOM EXPRESS</span>
          </div>
        </div>
      </div>

    </div>
  );
}