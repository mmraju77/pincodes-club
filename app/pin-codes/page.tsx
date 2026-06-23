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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtSummary, setDistrictSummary] = useState<any[]>([]);
  const [resultsData, setResultsData] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(inputValue), 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (selectedState && !selectedDistrict && !searchQuery) {
      const fetchDistricts = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('pincodes').select('district').eq('statename', selectedState);
        if (data) {
          const counts = new Map();
          data.forEach((row: any) => { const d = row.district || 'Unknown'; counts.set(d, (counts.get(d) || 0) + 1); });
          setDistrictSummary(Array.from(counts.entries()).map(([name, count]) => ({ name, count })).sort((a,b) => a.name.localeCompare(b.name)));
        }
        setIsLoading(false);
      };
      fetchDistricts();
    }
  }, [selectedState, selectedDistrict, searchQuery]);

  useEffect(() => {
    const fetchMainData = async () => {
      if (!searchQuery && !selectedDistrict) { setResultsData([]); return; }
      setIsLoading(true);
      let q = supabase.from('pincodes').select('*').limit(50);
      if (searchQuery) {
        if (/^\d+$/.test(searchQuery.trim())) q = q.eq('pincode', parseInt(searchQuery.trim()));
        else q = q.or(`officename.ilike.%${searchQuery.trim()}%`);
      } else if (selectedDistrict && selectedState) {
        q = q.eq('statename', selectedState).eq('district', selectedDistrict);
      }
      const { data } = await q;
      if (data) setResultsData(data);
      setIsLoading(false);
    };
    fetchMainData();
  }, [searchQuery, selectedDistrict, selectedState]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 text-white">
      <div className="bg-slate-800 p-8 rounded-3xl mb-10">
        <h1 className="text-3xl font-bold mb-4">India PIN Codes Hub</h1>
        <input type="text" placeholder="Search..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full bg-slate-900 p-3 rounded-lg border border-slate-700"/>
      </div>
      
      {isLoading && <p>Loading...</p>}

      {!searchQuery && !selectedState && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDIAN_STATES.map(s => <div key={s} onClick={() => setSelectedState(s)} className="bg-slate-900 p-4 rounded-xl cursor-pointer hover:bg-orange-600">{s}</div>)}
        </div>
      )}

      {selectedState && !selectedDistrict && !searchQuery && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {districtSummary.map(d => <div key={d.name} onClick={() => setSelectedDistrict(d.name)} className="bg-slate-900 p-4 rounded-xl cursor-pointer hover:bg-orange-600">{d.name}</div>)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {resultsData.map((r, i) => (
          <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="text-orange-400 font-bold">{r.officename}</h3>
            <p>Pincode: {r.pincode} | District: {r.district}</p>
          </div>
        ))}
      </div>
    </div>
  );
}