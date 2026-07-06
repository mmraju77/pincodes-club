'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';

const INDIAN_STATES = [
  "ANDAMAN AND NICOBAR ISLANDS", "ANDHRA PRADESH", "ARUNACHAL PRADESH", "ASSAM", "BIHAR",
  "CHANDIGARH", "CHHATTISGARH", "DADRA AND NAGAR HAVELI AND DAMAN AND DIU", "DELHI", "GOA",
  "GUJARAT", "HARYANA", "HIMACHAL PRADESH", "JAMMU AND KASHMIR", "JHARKHAND", "KARNATAKA",
  "KERALA", "LADAKH", "LAKSHADWEEP", "MADHYA PRADESH", "MAHARASHTRA", "MANIPUR", "MEGHALAYA",
  "MIZORAM", "NAGALAND", "ODISHA", "PUDUCHERRY", "PUNJAB", "RAJASTHAN", "SIKKIM", "TAMIL NADU",
  "TELANGANA", "TRIPURA", "UTTAR PRADESH", "UTTARAKHAND", "WEST BENGAL"
];

const POPULAR_BANKS = [
  "STATE BANK OF INDIA", "HDFC BANK", "ICICI BANK", "PUNJAB NATIONAL BANK",
  "BANK OF BARODA", "AXIS BANK", "CANARA BANK", "UNION BANK OF INDIA",
  "BANK OF INDIA", "INDIAN BANK", "CENTRAL BANK OF INDIA", "INDIAN OVERSEAS BANK",
  "KOTAK MAHINDRA BANK", "UCO BANK", "BANK OF MAHARASHTRA", "INDUSIND BANK",
  "PUNJAB AND SIND BANK", "YES BANK", "IDFC FIRST BANK", "BANDHAN BANK",
  "FEDERAL BANK", "SOUTH INDIAN BANK", "KARNATAKA BANK", "KARUR VYSYA BANK"
];

// Clean phone numbers
const formatContactNumber = (contact: any) => {
  if (!contact || contact === 'Not Available' || contact === 'NULL') return 'Not Available';
  let strContact = String(contact).trim();
  if (strContact.toUpperCase().includes('E')) return 'Not Available';
  if (strContact.endsWith('.0')) strContact = strContact.slice(0, -2);
  if (strContact === 'NaN' || strContact === '' || strContact === '0') return 'Not Available';
  return strContact;
};

export default function IfscDirectoryPage() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // The Strict 4-Step Hierarchy State
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  // Master Data Storage (To prevent multiple DB calls)
  const [bankStateData, setBankStateData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 1. Fetch ALL data for Bank + State ONE TIME (Super Fast Logic)
  useEffect(() => {
    if (selectedBank && selectedState && !searchQuery) {
      const fetchMasterData = async () => {
        setIsLoading(true); setDbError(null);
        try {
          const { data, error } = await supabase.from('ifsc_codes')
            .select('*')
            .ilike('bank', selectedBank)
            .ilike('state', selectedState)
            .limit(4000); // Fetch all branches for this state in one go
          
          if (error) throw error;
          if (data) setBankStateData(data);
        } catch (err: any) { 
          setDbError(`Database Error: ${err.message}`); 
        }
        setIsLoading(false);
      };
      fetchMasterData();
    } else if (!selectedState) {
      setBankStateData([]);
    }
  }, [selectedBank, selectedState, searchQuery]);

  // 2. Compute Districts from Master Data
  const districtList = useMemo(() => {
    if (bankStateData.length === 0) return [];
    return Array.from(new Set(bankStateData.map(d => d.district?.toUpperCase().trim())))
      .filter(Boolean)
      .sort();
  }, [bankStateData]);

  // 3. Compute Cities from Selected District
  const cityList = useMemo(() => {
    if (!selectedDistrict || bankStateData.length === 0) return [];
    return Array.from(new Set(
      bankStateData
        .filter(d => d.district?.toUpperCase().trim() === selectedDistrict)
        .map(d => (d.centre || d.city)?.toUpperCase().trim())
    )).filter(Boolean).sort();
  }, [selectedDistrict, bankStateData]);

  // 4. Compute Final Branches from Selected City
  const finalBranches = useMemo(() => {
    if (!selectedCity || bankStateData.length === 0) return [];
    return bankStateData.filter(d => 
      d.district?.toUpperCase().trim() === selectedDistrict &&
      (d.centre || d.city)?.toUpperCase().trim() === selectedCity
    );
  }, [selectedCity, selectedDistrict, bankStateData]);

  // Handle Free Text Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim().length > 2) setSearchQuery(inputValue);
      else if (inputValue === '') setSearchQuery('');
    }, 400); 
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    const fetchSearch = async () => {
      if (searchQuery.trim().length <= 2) { setSearchResults([]); return; }
      setIsLoading(true); setDbError(null);
      let q = supabase.from('ifsc_codes').select('*').limit(30);
      let qText = searchQuery.trim().toLowerCase();
      const dbQuery = qText.replace(/\s+/g, '%');
      q = q.or(`ifsc.ilike.%${dbQuery}%,branch.ilike.%${dbQuery}%,centre.ilike.%${dbQuery}%,district.ilike.%${dbQuery}%,bank.ilike.%${dbQuery}%`);
      
      const { data, error } = await q;
      if (error) { setDbError(error.message); setSearchResults([]); }
      else if (data) setSearchResults(data);
      setIsLoading(false);
    };
    fetchSearch();
  }, [searchQuery]);

  // View States
  const isSearching = searchQuery.trim().length > 2;
  const showBankList = !isSearching && !selectedBank;
  const showStateList = !isSearching && selectedBank && !selectedState;
  const showDistrictList = !isSearching && selectedBank && selectedState && !selectedDistrict;
  const showCityList = !isSearching && selectedBank && selectedState && selectedDistrict && !selectedCity;
  const showFinalBranches = !isSearching && selectedBank && selectedState && selectedDistrict && selectedCity;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <div className="flex-grow space-y-8">
        
        {/* EXACT HIERARCHY BREADCRUMBS */}
        {!isSearching && (
          <nav className="flex flex-wrap text-sm font-medium mb-8 items-center gap-2 bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-lg">
            <button onClick={() => {setSelectedBank(null); setSelectedState(null); setSelectedDistrict(null); setSelectedCity(null);}} className={`${!selectedBank ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white transition-colors'}`}>BANKS</button>
            
            {selectedBank && (
              <>
                <span className="text-slate-600">➔</span>
                <button onClick={() => {setSelectedState(null); setSelectedDistrict(null); setSelectedCity(null);}} className={`${!selectedState ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white transition-colors'} capitalize`} translate="no">{selectedBank.toLowerCase()}</button>
              </>
            )}
            
            {selectedState && (
              <>
                <span className="text-slate-600">➔</span>
                <button onClick={() => {setSelectedDistrict(null); setSelectedCity(null);}} className={`${!selectedDistrict ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white transition-colors'} capitalize`} translate="no">{selectedState.toLowerCase()}</button>
              </>
            )}

            {selectedDistrict && (
              <>
                <span className="text-slate-600">➔</span>
                <button onClick={() => setSelectedCity(null)} className={`${!selectedCity ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white transition-colors'} capitalize`} translate="no">{selectedDistrict.toLowerCase()}</button>
              </>
            )}

            {selectedCity && (
              <>
                <span className="text-slate-600">➔</span>
                <span className="text-blue-400 font-bold capitalize" translate="no">{selectedCity.toLowerCase()}</span>
              </>
            )}
          </nav>
        )}

        <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase">Banking Directory</div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">India IFSC Codes Hub</h1>
              <p className="text-slate-300 text-base font-light">Follow the path: Bank ➔ State ➔ District ➔ City to find branches.</p>
            </div>
            <div className="w-full md:w-96 relative flex items-center">
              <svg className="w-5 h-5 absolute left-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" placeholder="Search any Branch, IFSC, City..." 
                value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-medium"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-24 text-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400">Loading data...</p></div>
        ) : (
          <>
            {showBankList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {POPULAR_BANKS.map((name, i) => (
                  <div key={i} onClick={() => setSelectedBank(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50 transition-colors">
                    <div className="text-4xl mb-4">🏦</div>
                    <h3 className="text-lg font-bold text-white mb-2 capitalize" translate="no">{name.toLowerCase()}</h3>
                    <span className="text-blue-400 text-xs font-bold mt-auto">Select Bank ➔</span>
                  </div>
                ))}
              </div>
            )}

            {showStateList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {INDIAN_STATES.map((name, i) => (
                  <div key={i} onClick={() => setSelectedState(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50 transition-colors">
                    <div className="text-4xl mb-4">🗺️</div>
                    <h3 className="text-lg font-bold text-white mb-2 capitalize" translate="no">{name.toLowerCase()}</h3>
                    <span className="text-blue-400 text-xs font-bold mt-auto">Select State ➔</span>
                  </div>
                ))}
              </div>
            )}

            {showDistrictList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {districtList.length > 0 ? districtList.map((name, i) => (
                  <div key={i} onClick={() => setSelectedDistrict(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50 transition-colors">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-lg font-bold text-white mb-2 capitalize text-center" translate="no">{name.toLowerCase()}</h3>
                    <span className="text-blue-400 text-xs font-bold mt-auto">Select District ➔</span>
                  </div>
                )) : <div className="col-span-full py-12 text-center text-slate-400">No Districts Found.</div>}
              </div>
            )}

            {showCityList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cityList.length > 0 ? cityList.map((name, i) => (
                  <div key={i} onClick={() => setSelectedCity(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50 transition-colors border-t-2 border-t-blue-500">
                    <div className="text-4xl mb-4">🏙️</div>
                    <h3 className="text-lg font-bold text-white mb-2 capitalize text-center" translate="no">{name.toLowerCase()}</h3>
                    <span className="text-blue-400 text-xs font-bold mt-auto">Select City ➔</span>
                  </div>
                )) : <div className="col-span-full py-12 text-center text-slate-400">No Cities Found.</div>}
              </div>
            )}

            {(showFinalBranches || isSearching) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(isSearching ? searchResults : finalBranches).length > 0 ? (isSearching ? searchResults : finalBranches).map((row: any, index: number) => {
                  const contact = formatContactNumber(row.contact || row.phone);
                  return (
                    <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 relative shadow-xl transition-all">
                      <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                        <div className="flex-1 pr-4">
                          <h3 className="text-xl font-bold text-blue-400 mb-1 capitalize" translate="no">{(row.bank || 'N/A').toLowerCase()}</h3>
                          <p className="text-sm font-semibold text-slate-300 capitalize" translate="no">📍 {(row.branch || 'N/A').toLowerCase()}</p>
                        </div>
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-black tracking-widest">{row.ifsc || 'N/A'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">City / Centre</span><span className="text-white font-medium capitalize" translate="no">{(row.centre || row.city || 'N/A').toLowerCase()}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">Contact Number</span><span className="text-white font-medium">{contact}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">MICR Code</span><span className="text-white font-medium">{row.micr || 'Not Available'}</span></div>
                        <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">District</span><span className="text-white font-medium capitalize" translate="no">{(row.district || 'N/A').toLowerCase()}</span></div>
                        <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">State</span><span className="text-white font-medium capitalize" translate="no">{(row.state || 'N/A').toLowerCase()}</span></div>
                        <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">Address</span><span className="text-white text-xs capitalize" translate="no">{(row.address || 'N/A').toLowerCase()}</span></div>
                      </div>
                    </div>
                  )
                }) : <div className="col-span-full py-12 text-center text-slate-400">No branches found matching your selection.</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}