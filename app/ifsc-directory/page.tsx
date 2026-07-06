'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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

// Helper function to thoroughly clean contact numbers
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
  const [isListening, setIsListening] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // THE PERFECT 4-STEP PATH
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const [districtList, setDistrictList] = useState<string[]>([]);
  const [cityList, setCityList] = useState<string[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim().length > 2 || inputValue === '') {
         setSearchQuery(inputValue);
      }
    }, 400); 
    return () => clearTimeout(timer);
  }, [inputValue]);

  // STEP 1: Fetch Districts
  useEffect(() => {
    if (selectedBank && selectedState && !selectedDistrict && !searchQuery) {
      const fetchDistricts = async () => {
        setIsLoading(true); setDbError(null);
        try {
          const { data, error } = await supabase.from('ifsc_codes')
            .select('district')
            .ilike('bank', selectedBank)
            .ilike('state', selectedState)
            .limit(5000);
          
          if (error) throw error;
          if (data) {
            const uniqueDists = Array.from(new Set(data.map((r: any) => r.district)))
              .filter(Boolean)
              .map(d => String(d).toUpperCase().trim())
              .sort();
            setDistrictList(uniqueDists);
          }
        } catch (err: any) { setDbError(`Database Error: ${err.message}`); }
        setIsLoading(false);
      };
      fetchDistricts();
    }
  }, [selectedBank, selectedState, selectedDistrict, searchQuery]);

  // STEP 2: Fetch Cities (NEW STEP ADDED FOR EXACT PATH)
  useEffect(() => {
    if (selectedBank && selectedState && selectedDistrict && !selectedCity && !searchQuery) {
      const fetchCities = async () => {
        setIsLoading(true); setDbError(null);
        try {
          // We check both centre and city columns depending on bank data format
          const { data, error } = await supabase.from('ifsc_codes')
            .select('centre, city')
            .ilike('bank', selectedBank)
            .ilike('state', selectedState)
            .ilike('district', selectedDistrict)
            .limit(2000);
          
          if (error) throw error;
          if (data) {
            const uniqueCities = Array.from(new Set(data.map((r: any) => r.centre || r.city)))
              .filter(Boolean)
              .map(c => String(c).toUpperCase().trim())
              .sort();
            setCityList(uniqueCities);
          }
        } catch (err: any) { setDbError(`Database Error: ${err.message}`); }
        setIsLoading(false);
      };
      fetchCities();
    }
  }, [selectedBank, selectedState, selectedDistrict, selectedCity, searchQuery]);

  // STEP 3: Fetch Final Branch Data
  useEffect(() => {
    const fetchMainData = async () => {
      if (!searchQuery && !selectedCity) { setResultsData([]); return; }
      setIsLoading(true); setDbError(null);

      let q = supabase.from('ifsc_codes').select('*').limit(30);

      if (selectedBank && !searchQuery) q = q.ilike('bank', selectedBank);
      if (selectedState && !searchQuery) q = q.ilike('state', selectedState);
      if (selectedDistrict && !searchQuery) q = q.ilike('district', selectedDistrict);
      
      // If city is selected, filter by city/centre
      if (selectedCity && !searchQuery) {
          q = q.or(`centre.ilike.${selectedCity},city.ilike.${selectedCity}`);
      }

      let qText = searchQuery.trim().toLowerCase();
      if (qText && !selectedCity) {
         const dbQuery = qText.replace(/\s+/g, '%');
         q = q.or(`ifsc.ilike.%${dbQuery}%,branch.ilike.%${dbQuery}%,centre.ilike.%${dbQuery}%,district.ilike.%${dbQuery}%,bank.ilike.%${dbQuery}%`);
      }

      const { data, error } = await q;
      if (error) { setDbError(`Database Error: ${error.message}`); setResultsData([]); } 
      else if (data) { 
        const uniqueResults = data.filter((v, i, a) => a.findIndex(t => (t.ifsc === v.ifsc)) === i);
        setResultsData(uniqueResults); 
      }
      setIsLoading(false);
    };
    
    if (searchQuery.trim().length > 2 || selectedCity) fetchMainData();
    else setResultsData([]);
  }, [searchQuery, selectedBank, selectedState, selectedDistrict, selectedCity]);

  // Navigation Handlers
  const handleVoiceSearch = () => { /* Voice logic remains same */ };
  const resetToBanks = () => { setSelectedBank(null); setSelectedState(null); setSelectedDistrict(null); setSelectedCity(null); setSearchQuery(''); setInputValue(''); };
  const resetToStates = () => { setSelectedState(null); setSelectedDistrict(null); setSelectedCity(null); setSearchQuery(''); setInputValue(''); };
  const resetToDistricts = () => { setSelectedDistrict(null); setSelectedCity(null); setSearchQuery(''); setInputValue(''); };
  const resetToCities = () => { setSelectedCity(null); setSearchQuery(''); setInputValue(''); };

  // View States
  const showBankList = !searchQuery && !selectedBank;
  const showStateList = !searchQuery && selectedBank && !selectedState;
  const showDistrictList = !searchQuery && selectedBank && selectedState && !selectedDistrict;
  const showCityList = !searchQuery && selectedBank && selectedState && selectedDistrict && !selectedCity;
  const showResultsList = (searchQuery.trim().length > 2) || (selectedBank && selectedState && selectedDistrict && selectedCity);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <div className="flex-grow space-y-8">
        
        {/* EXACT PATH BREADCRUMBS - Dynamic Path Indication */}
        <nav className="flex flex-wrap text-sm font-medium mb-8 items-center gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <button onClick={resetToBanks} className={`${!selectedBank ? 'text-white' : 'text-slate-400 hover:text-blue-400'}`}>BANKS</button>
          
          {selectedBank && (
            <>
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              <button onClick={resetToStates} className={`${!selectedState ? 'text-white' : 'text-slate-400 hover:text-blue-400'} capitalize`} translate="no">{selectedBank.toLowerCase()}</button>
            </>
          )}
          
          {selectedState && (
            <>
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              <button onClick={resetToDistricts} className={`${!selectedDistrict ? 'text-white' : 'text-slate-400 hover:text-blue-400'} capitalize`} translate="no">{selectedState.toLowerCase()}</button>
            </>
          )}

          {selectedDistrict && (
            <>
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              <button onClick={resetToCities} className={`${!selectedCity ? 'text-white' : 'text-slate-400 hover:text-blue-400'} capitalize`} translate="no">{selectedDistrict.toLowerCase()}</button>
            </>
          )}

          {selectedCity && (
            <>
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              <span className="text-white capitalize" translate="no">{selectedCity.toLowerCase()}</span>
            </>
          )}
        </nav>

        {/* ... Search Bar UI ... */}
        <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase">Banking Directory</div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">India IFSC Codes Hub</h1>
              <p className="text-slate-300 text-base font-light max-w-xl">Follow the path: Bank ➔ State ➔ District ➔ City to find branches.</p>
            </div>
            
            <div className="w-full md:w-96 relative flex items-center">
              <svg className="w-5 h-5 absolute left-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" placeholder="Search any Branch, IFSC, City..." 
                value={inputValue} onChange={(e) => setInputValue(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-medium"
              />
            </div>
          </div>
        </div>

        {/* Back Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {showStateList && <button onClick={resetToBanks} className="text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg text-sm">← Back to Banks</button>}
          {showDistrictList && <button onClick={resetToStates} className="text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg text-sm">← Back to States</button>}
          {showCityList && <button onClick={resetToDistricts} className="text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg text-sm">← Back to Districts</button>}
          {showResultsList && !searchQuery && <button onClick={resetToCities} className="text-blue-400 bg-blue-500/10 px-4 py-2 rounded-lg text-sm">← Back to Cities</button>}
          {searchQuery && <button onClick={() => { setSearchQuery(''); setInputValue(''); }} className="text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-sm">✕ Clear Search</button>}
        </div>

        {isLoading ? (
          <div className="py-24 text-center"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-slate-400">Loading data...</p></div>
        ) : (
          <>
            {dbError && <div className="bg-red-500/10 p-6 rounded-xl text-center"><p className="text-red-400">{dbError}</p></div>}

            {showBankList && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {POPULAR_BANKS.map((name, i) => (
                  <div key={i} onClick={() => setSelectedBank(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50">
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
                  <div key={i} onClick={() => setSelectedState(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50">
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
                  <div key={i} onClick={() => setSelectedDistrict(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50">
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
                  <div key={i} onClick={() => setSelectedCity(name)} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center cursor-pointer hover:border-blue-500/50 border-t-2 border-t-blue-500">
                    <div className="text-4xl mb-4">🏙️</div>
                    <h3 className="text-lg font-bold text-white mb-2 capitalize text-center" translate="no">{name.toLowerCase()}</h3>
                    <span className="text-blue-400 text-xs font-bold mt-auto">View Branches ➔</span>
                  </div>
                )) : <div className="col-span-full py-12 text-center text-slate-400">No Cities Found.</div>}
              </div>
            )}

            {showResultsList && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {resultsData.length > 0 ? resultsData.map((row: any, index: number) => {
                  const contact = formatContactNumber(row.contact || row.phone);
                  return (
                    <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 relative shadow-xl">
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

      <div className="mt-auto pt-12 pb-4 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-xs font-medium">© 2026 Pincode Club. | <span className="text-blue-400 font-bold">App Version: 7.0 (Perfect 5-Step Path)</span></p>
      </div>
    </div>
  );
}