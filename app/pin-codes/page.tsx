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
  const [showStateList, setShowStateList] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (selectedState) {
      fetchDistricts(selectedState);
      setSelectedDistrict('');
      setResultsData([]);
      setCurrentPage(1);
      setShowStateList(false);
    } else {
      setShowStateList(true);
      setDistrictsList([]);
      setResultsData([]);
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
    const { data } = await supabase
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
    const { data } = await supabase
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
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-8">
      
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {selectedDistrict ? `${selectedDistrict} PIN Codes` : 
           selectedState ? `${selectedState} Districts` : 
           "Directory of India PIN Codes"}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {selectedDistrict ? `Explore all post offices and pincodes in ${selectedDistrict}.` : 
           selectedState ? `Select a district from ${selectedState} to view pincodes.` : 
           "Find accurate postal codes for any state, district, or village in India."}
        </p>
      </div>

      {/* Navigation Breadcrumb */}
      {(selectedState || selectedDistrict) && (
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-8">
          <button 
            onClick={() => { setSelectedState(''); setSelectedDistrict(''); }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition-colors text-sm"
          >
            ALL STATES
          </button>
          
          {selectedState && (
            <>
              <span className="text-slate-600 font-bold">&rarr;</span>
              <button 
                onClick={() => setSelectedDistrict('')}
                className={`px-4 py-2 font-bold rounded-lg transition-colors text-sm ${!selectedDistrict ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
              >
                {selectedState.toUpperCase()}
              </button>
            </>
          )}

          {selectedDistrict && (
            <>
              <span className="text-slate-600 font-bold">&rarr;</span>
              <span className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold rounded-lg text-sm">
                {selectedDistrict.toUpperCase()}
              </span>
            </>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Fetching data...</p>
        </div>
      ) : (
        <>
          {/* 1. Show States Grid (IFSC Style Cards) */}
          {showStateList && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {INDIAN_STATES.map((stateName, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedState(stateName)}
                  className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-800/60 cursor-pointer transition-all group shadow-lg"
                >
                  <div className="mb-4 text-slate-400 group-hover:text-white transition-colors">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-6 text-center">
                    {stateName}
                  </h3>
                  <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Select State &rarr;
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 2. Show Districts Grid (IFSC Style Cards) */}
          {selectedState && !selectedDistrict && districtsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {districtsList.map((districtName, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedDistrict(districtName)}
                  className="bg-[#0f172a] border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center hover:bg-slate-800/60 cursor-pointer transition-all group shadow-lg"
                >
                  <div className="mb-4 text-slate-400 group-hover:text-white transition-colors">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-6 text-center">
                    {districtName}
                  </h3>
                  <span className="bg-blue-600/20 text-blue-400 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Select District &rarr;
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 3. Show Pincode Cards */}
          {selectedDistrict && currentResults.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentResults.map((item, index) => (
                  <Link 
                    key={index}
                    href={`/pin-codes/${encodeURIComponent(item.state_name)}/${encodeURIComponent(item.district)}/${item.pincode}`}
                    className="group block h-full"
                  >
                    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer h-full relative overflow-hidden shadow-lg flex flex-col">
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="pr-4">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                            {item.office_name}
                          </h3>
                          <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-400 rounded-md uppercase">
                            {item.office_type || 'POST OFFICE'}
                          </span>
                        </div>
                        <span className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black px-4 py-2 rounded-xl shadow-lg text-lg flex-shrink-0">
                          {item.pincode}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mt-auto bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">District</p>
                          <p className="text-slate-300 font-medium truncate">{item.district}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-bold uppercase text-[10px] mb-1">State</p>
                          <p className="text-slate-300 font-medium truncate">{item.state_name}</p>
                        </div>
                      </div>
                      
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-8">
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    &larr; Prev
                  </button>
                  <span className="text-slate-400 font-medium bg-slate-900/50 px-6 py-3 rounded-xl border border-slate-800">
                    <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                  </span>
                  <button 
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

        </>
      )}

    </div>
  );
}