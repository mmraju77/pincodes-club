// @ts-nocheck
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ATMLocatorPage() {
  const [city, setCity] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [atmResults, setAtmResults] = useState<any[]>([]);

  // List of top banks for the dropdown
  const topBanks = [
    "State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", 
    "Axis Bank", "Punjab National Bank", "Bank of Baroda", 
    "Union Bank of India", "Canara Bank"
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    
    setIsSearching(true);
    setAtmResults([]);

    // Simulated Smart Search (Will be connected to Supabase IFSC table later)
    setTimeout(() => {
      setIsSearching(false);
      
      // Mock data showing nearby ATMs based on city
      setAtmResults([
        { id: 1, bank: selectedBank || 'State Bank of India', address: `Main Road, ${city}`, status: 'Open 24/7', type: 'Cash Withdrawal & Deposit' },
        { id: 2, bank: selectedBank || 'HDFC Bank', address: `Near Bus Stand, ${city}`, status: 'Open 24/7', type: 'Cash Withdrawal Only' },
        { id: 3, bank: 'ICICI Bank', address: `Shopping Mall Complex, ${city}`, status: 'Out of Service', type: 'Cash Withdrawal' },
        { id: 4, bank: 'Axis Bank', address: `Railway Station Road, ${city}`, status: 'Open 24/7', type: 'Cash Withdrawal & Deposit' }
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-teal-500/10 rounded-2xl mb-2">
          <span className="text-6xl drop-shadow-md">🏧</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">ATM Locator</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Find the nearest 24/7 ATMs, cash deposit machines, and bank branches in your city instantly.
        </p>
      </div>

      {/* Main Search Panel */}
      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden mb-12">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* City Input */}
            <div className="relative">
              <label className="block text-sm font-bold text-slate-400 mb-2">ENTER CITY / PINCODE</label>
              <div className="absolute inset-y-0 top-7 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-teal-500 rounded-xl text-white font-medium outline-none transition-all shadow-inner uppercase"
                placeholder="E.g., HYDERABAD or 500001"
                required
              />
            </div>

            {/* Bank Dropdown */}
            <div className="relative">
              <label className="block text-sm font-bold text-slate-400 mb-2">SELECT BANK (OPTIONAL)</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-teal-500 rounded-xl text-white font-medium outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">All Banks</option>
                {topBanks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 top-7 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSearching}
                className={`w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 ${isSearching ? 'animate-pulse' : 'hover:-translate-y-1'}`}
              >
                {isSearching ? 'Locating ATMs...' : 'Find ATMs Near Me'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Dynamic Results Grid */}
      {atmResults.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Found {atmResults.length} ATMs near {city.toUpperCase()}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {atmResults.map((atm) => (
              <div key={atm.id} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:border-teal-500/50 rounded-2xl p-6 shadow-xl transition-all group flex gap-4">
                
                {/* Icon Map Pin */}
                <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {atm.bank} ATM
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${atm.status.includes('Open') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {atm.status}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{atm.address}</p>
                  
                  <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {atm.type}
                    </span>
                    <button className="text-sm font-bold text-teal-400 hover:text-white transition-colors flex items-center gap-1">
                      Get Directions 
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}