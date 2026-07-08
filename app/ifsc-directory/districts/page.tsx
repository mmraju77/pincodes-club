'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

const formatToSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function DistrictsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districts, setDistricts] = useState<{district: string, state: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [selectedLocation, setSelectedLocation] = useState<{district: string, state: string} | null>(null);
  const [districtBanks, setDistrictBanks] = useState<string[]>([]);
  const [isFetchingBanks, setIsFetchingBanks] = useState(false);
  
  const router = useRouter();

  // Load all districts initially or search
  useEffect(() => {
    const fetchDistricts = async () => {
      setIsLoading(true);
      try {
        let q = supabase.from('ifsc_codes').select('district, state');
        
        if (searchTerm.trim().length >= 3) {
           q = q.ilike('district', `%${searchTerm.trim()}%`).limit(100);
        } else {
           q = q.limit(200); 
        }

        const { data, error } = await q;
          
        if (data && !error) {
          const uniqueSet = new Set(data.map(d => JSON.stringify({ district: d.district, state: d.state })));
          let uniqueArray = Array.from(uniqueSet).map(s => JSON.parse(s));
          uniqueArray.sort((a, b) => (a.district > b.district) ? 1 : -1);
          setDistricts(uniqueArray);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    const timer = setTimeout(fetchDistricts, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // EXPERT ARCHITECTURE: Fetch ONLY the banks available in the clicked district
  const handleDistrictClick = async (item: {district: string, state: string}) => {
    setSelectedLocation(item);
    setIsFetchingBanks(true);
    setDistrictBanks([]); // Clear previous modal data
    
    try {
      const { data, error } = await supabase
        .from('ifsc_codes')
        .select('bank')
        .eq('district', item.district)
        .eq('state', item.state);
        
      if (data && !error) {
        // Extract unique bank names for this specific district and sort them
        const uniqueBanks = Array.from(new Set(data.map(d => d.bank))).filter(Boolean) as string[];
        uniqueBanks.sort();
        setDistrictBanks(uniqueBanks);
      }
    } catch (err) {
      console.error("Error fetching banks for district:", err);
    }
    setIsFetchingBanks(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen relative">
      
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
            <Link href="/ifsc-directory" className="text-blue-400 hover:text-white flex items-center gap-2 text-sm font-medium bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
            <span>&larr;</span> Back to Directory Hub
            </Link>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Search by District</h1>
        <p className="text-slate-400 mb-8">Type your district name below to fetch all available banks in that region.</p>
        
        <div className="relative">
          <svg className="w-6 h-6 absolute left-4 top-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Enter District Name (e.g. Visakhapatnam, Mumbai)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border-2 border-slate-700 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all shadow-xl font-medium text-lg"
          />
        </div>
      </div>

      {isLoading ? (
         <div className="text-center py-12">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-slate-400">Loading Districts...</p>
         </div>
      ) : districts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {districts.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => handleDistrictClick(item)}
              className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <h3 className="text-white font-bold text-lg mb-1 capitalize group-hover:text-blue-400" translate="no">{item.district?.toLowerCase()}</h3>
              <p className="text-slate-500 text-xs uppercase tracking-wider">{item.state}</p>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-12 text-slate-400">
             No districts found matching "{searchTerm}"
         </div>
      )}

      {/* Dynamic Smart Modal for District Banks */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="bg-slate-800 border-2 border-purple-500/50 rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-bl-full -z-10 blur-2xl"></div>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-600">
              <div>
                <h2 className="text-3xl font-extrabold text-white">Select a Bank</h2>
                <p className="text-purple-400 text-sm font-bold mt-1 uppercase tracking-wide">in {selectedLocation.district?.toLowerCase()}, {selectedLocation.state?.toLowerCase()}</p>
              </div>
              <button onClick={() => setSelectedLocation(null)} className="text-slate-300 hover:text-white bg-slate-700 hover:bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all shadow-lg">&times;</button>
            </div>
            
            {isFetchingBanks ? (
               <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-medium">Scanning Live Database for Banks...</p>
               </div>
            ) : districtBanks.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                 {districtBanks.map(bank => (
                   <button 
                     key={bank} 
                     onClick={() => router.push(`/ifsc-directory/${formatToSlug(bank)}/${formatToSlug(selectedLocation.state)}/${formatToSlug(selectedLocation.district)}`)}
                     className="bg-slate-900/80 p-4 rounded-xl border border-slate-600 hover:border-purple-400 hover:bg-slate-700 text-sm font-extrabold text-amber-400 hover:text-amber-300 transition-all text-center flex items-center justify-center break-words shadow-md hover:shadow-purple-500/20"
                   >
                     {bank}
                   </button>
                 ))}
               </div>
            ) : (
               <div className="text-center py-12">
                  <p className="text-slate-300 text-lg font-semibold">No active banks found in this district.</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}