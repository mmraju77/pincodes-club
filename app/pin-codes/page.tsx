'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function PincodePage() {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtSummary, setDistrictSummary] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
      setShowSuggestions(inputValue.length >= 2);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      let q = supabase.from('pincodes').select('officename, pincode, district, statename').limit(6);
      if (/^\d+$/.test(searchQuery.trim())) {
        q = q.eq('pincode', parseInt(searchQuery.trim()));
      } else {
        q = q.or(`officename.ilike.%${searchQuery.trim()}%`);
      }
      const { data } = await q;
      if (data) setSuggestions(data);
    };
    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedState && !selectedDistrict && !searchQuery) {
      const fetchDistricts = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('pincodes').select('district').eq('statename', selectedState);
        if (data) {
          const counts = new Map();
          data.forEach((row: any) => {
            const d = row.district || 'Unknown';
            counts.set(d, (counts.get(d) || 0) + 1);
          });
          const dists = Array.from(counts.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => a.name.localeCompare(b.name));
          setDistrictSummary(dists);
        }
        setIsLoading(false);
      };
      fetchDistricts();
    }
  }, [selectedState, selectedDistrict, searchQuery]);

  useEffect(() => {
    const fetchMainData = async () => {
      if (!searchQuery && !selectedDistrict) {
        setResultsData([]);
        return;
      }
      setIsLoading(true);
      let q = supabase.from('pincodes').select('*', { count: 'exact' });
      if (searchQuery) {
        if (/^\d+$/.test(searchQuery.trim())) {
          q = q.eq('pincode', parseInt(searchQuery.trim()));
        } else {
          q = q.or(`officename.ilike.%${searchQuery.trim()}%`);
        }
      } else if (selectedDistrict && selectedState) {
        q = q.eq('statename', selectedState).eq('district', selectedDistrict);
      }
      const { data, count } = await q.range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      if (data) { setResultsData(data); setTotalResults(count || 0); }
      setIsLoading(false);
    };
    fetchMainData();
  }, [searchQuery, selectedDistrict, selectedState, currentPage]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 text-white">
      <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50">
        <h1 className="text-4xl font-extrabold mb-4">India PIN Codes Hub</h1>
        <input 
          type="text" 
          placeholder="Search..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
          className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4"
        />
      </div>

      {isLoading && <p className="text-center mt-10">Loading...</p>}

      {!isLoading && showStateList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {INDIAN_STATES.map((state) => (
            <div key={state} onClick={() => setSelectedState(state)} className="bg-slate-900 p-6 rounded-2xl cursor-pointer hover:border-orange-500 border border-slate-800">
              <h3 className="font-bold">{state}</h3>
            </div>
          ))}
        </div>
      )}

      {selectedState && !selectedDistrict && !searchQuery && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {districtSummary.map((dist) => (
            <div key={dist.name} onClick={() => setSelectedDistrict(dist.name)} className="bg-slate-900 p-6 rounded-2xl cursor-pointer border border-slate-800">
              <h3 className="font-bold">{dist.name}</h3>
            </div>
          ))}
        </div>
      )}

      {resultsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {resultsData.map((row, i) => (
            <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-orange-400">{row.officename}</h3>
              <p>Pincode: {row.pincode}</p>
              <p>District: {row.district}</p>
              <p>State: {row.statename}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}