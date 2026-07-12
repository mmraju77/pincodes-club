// @ts-nocheck
'use client';

import { useState } from 'react';

export default function CourierTrackingPage() {
  const [trackingId, setTrackingId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId) return;
    
    setIsSearching(true);
    setTrackingResult(null);
    setErrorMsg('');

    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId })
      });

      const data = await response.json();

      if (data.error || (data.meta && data.meta.code !== 200 && data.meta.code !== 4006)) {
        setErrorMsg('Invalid Tracking Number or Courier not found. Please try again.');
      } else {
        // Extract real data from TrackingMore JSON response
        const item = Array.isArray(data.data) ? data.data[0] : data.data;
        const courierCode = item?.courier_code || 'DETECTING...';
        const rawTimeline = item?.origin_info?.trackinfo || [];
        
        const steps = rawTimeline.length > 0 ? rawTimeline.map((track: any) => ({
          time: track.checkpoint_date || new Date().toLocaleString(),
          desc: track.tracking_detail || track.StatusDescription,
          loc: track.location || 'In Transit'
        })) : [
          { time: new Date().toLocaleString(), desc: 'Tracking registered. Awaiting live update from courier...', loc: 'System' }
        ];

        setTrackingResult({
          id: trackingId.toUpperCase(),
          courier: courierCode.toUpperCase(),
          status: item?.delivery_status || 'PENDING',
          expectedDelivery: item?.expected_delivery || 'Awaiting Update',
          steps: steps
        });
      }
    } catch (err) {
      setErrorMsg('Connection failed. Please check your internet.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 min-h-screen">
      
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

      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden mb-8">
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
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-orange-500 rounded-xl text-white text-lg placeholder-slate-500 outline-none transition-all shadow-inner uppercase"
                placeholder="Enter valid AWB (e.g., EA123456789IN)"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 ${isSearching ? 'animate-pulse' : 'hover:-translate-y-1'}`}
            >
              {isSearching ? 'Locating...' : 'Track Now'}
            </button>
          </div>
        </form>
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-semibold mb-8 animate-fade-in-up">
          {errorMsg}
        </div>
      )}

      {trackingResult && (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 p-6 md:p-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-6 mb-6 gap-4">
            <div>
              <p className="text-slate-400 text-sm font-semibold mb-1">TRACKING ID: <span className="text-white">{trackingResult.id}</span></p>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                {trackingResult.courier}
              </h2>
            </div>
            <div className="text-left md:text-right">
              <p className="text-slate-400 text-sm font-semibold mb-1">STATUS</p>
              <p className="text-xl font-bold text-orange-400 uppercase">{trackingResult.status}</p>
            </div>
          </div>

          <div className="space-y-6">
            {trackingResult.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 relative">
                {index !== trackingResult.steps.length - 1 && (
                  <div className="absolute top-8 left-3.5 w-0.5 h-full bg-slate-700"></div>
                )}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 flex-shrink-0 mt-1 ${index === 0 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${index === 0 ? 'text-white' : 'text-slate-300'}`}>{step.desc}</h3>
                  <p className="text-slate-400 text-sm mt-1">{step.time} • <span className="text-slate-500 font-medium">{step.loc}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}