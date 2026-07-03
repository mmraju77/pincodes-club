'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const INDIAN_STATES = [
  "Andaman & Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam",
  "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli",
  "Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha",
  "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function PincodesPage() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
      setSelectedDistrict('');
      setResultsData([]);
      setCurrentPage(1);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState && selectedDistrict) {
      fetchPincodes(selectedState, selectedDistrict);
      setCurrentPage(1);
    }
  }, [selectedDistrict]);

  const fetchDistricts = async (state: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('pincodes')
      .select('district')
      .eq('state_name', state)
      .order('district');
    
    if (data) {
      const uniqueDistricts = Array.from(new Set(data.map(d => d.district)));
      setDistrictsList(uniqueDistricts as string[]);
    }
    setIsLoading(false);
  };

  const fetchPincodes = async (state: string, district: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('pincodes')
      .select('*')
      .eq('state_name', state)
      .eq('district', district)
      .order('office_name');
      
    if (data) {
      setResultsData(data);
    }
    setIsLoading(false);
  };

  const totalPages = Math.ceil(resultsData.length / itemsPerPage);
  const currentResults = resultsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      
      {/* Selection Path */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Browse PIN Codes
        </h1>
        <p className="text-slate-400 text-lg">Select your State and District to explore postal details.</p>
      </div>

      <div className="bg-slate-900/50 p-6 md:p-8 rounded-3xl border border-slate-800 mb-12 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* State Selector */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-400 uppercase mb-2">1. Select State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-4 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
            >
              <option value="">-- Choose State --</option>
              {INDIAN_STATES.map((state, i) => (
                <option key={i} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-400 uppercase mb-2">2. Select District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedState || districtsList.length === 0}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl p-4 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none disabled:opacity-50"
            >
              <option value="">-- Choose District --</option>
              {districtsList.map((dist, i) => (
                <option key={i} value={dist}>{dist}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="py-24 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && currentResults.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-orange-500">{resultsData.length}</span> Post Offices found
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentResults.map((item, index) => (
              // 🚀 లింక్ ఇక్కడే యాడ్ చేశాను 
              <Link 
                key={index}
                href={`/pin-codes/${encodeURIComponent(item.state_name)}/${encodeURIComponent(item.district)}/${item.pincode}`}
                className="group block"
              >
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 hover:border-orange-500/50 transition-all cursor-pointer h-full relative overflow-hidden">
                  
                  {/* Decorative background accent on hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                        {item.office_name}
                      </h3>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-md">
                        {item.office_type || 'PO'}
                      </span>
                    </div>
                    <span className="bg-orange-500 text-white font-black px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 text-lg">
                      {item.pincode}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mt-auto">
                    <div>
                      <p className="text-slate-500 font-medium uppercase text-xs">District</p>
                      <p className="text-slate-300 font-bold truncate">{item.district}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium uppercase text-xs">State</p>
                      <p className="text-slate-300 font-bold truncate">{item.state_name}</p>
                    </div>
                  </div>
                  
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
              >
                Previous
              </button>
              <span className="text-slate-400 font-medium bg-slate-900/50 px-6 py-3 rounded-xl border border-slate-800">
                Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && selectedDistrict && currentResults.length === 0 && (
        <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <p className="text-slate-400 text-lg">No post offices found for the selected area.</p>
        </div>
      )}

    </div>
  );
}