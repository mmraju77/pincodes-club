'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

const ALL_BANKS = [
  "Abhyudaya Co-operative Bank", "Airtel Payments Bank", "Allahabad Bank", "Andhra Bank", "Axis Bank", "Bandhan Bank", 
  "Bank of Baroda", "Bank of India", "Bank of Maharashtra", "Canara Bank", "Central Bank of India", "Citi Bank", 
  "City Union Bank", "Corporation Bank", "DBS Bank", "Dena Bank", "Equitas Small Finance Bank", "Federal Bank", 
  "HDFC Bank", "ICICI Bank", "IDBI Bank", "IDFC First Bank", "Indian Bank", "Indian Overseas Bank", "Indusind Bank", 
  "Jammu and Kashmir Bank", "Karnataka Bank", "Karur Vysya Bank", "Kotak Mahindra Bank", "Paytm Payments Bank", 
  "Punjab National Bank", "RBL Bank", "South Indian Bank", "State Bank of India", "Syndicate Bank", "UCO Bank", 
  "Union Bank of India", "Yes Bank"
];

const formatToSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function DistrictsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districts, setDistricts] = useState<{district: string, state: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{district: string, state: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDistricts = async () => {
      if (searchTerm.trim().length < 3) {
        setDistricts([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('ifsc_codes')
          .select('district, state')
          .ilike('district', `%${searchTerm.trim()}%`)
          .limit(100);
          
        if (data && !error) {
          // Remove duplicates to show clean distinct district names
          const uniqueSet = new Set(data.map(d => JSON.stringify({ district: d.district, state: d.state })));
          const uniqueArray = Array.from(uniqueSet).map(s => JSON.parse(s));
          setDistricts(uniqueArray);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    const timer = setTimeout(fetchDistricts, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
             <p className="text-slate-400">Searching Districts...</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {districts.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedLocation(item)}
              className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              <h3 className="text-white font-bold text-lg mb-1 capitalize group-hover:text-blue-400" translate="no">{item.district?.toLowerCase()}</h3>
              <p className="text-slate-500 text-xs uppercase tracking-wider">{item.state}</p>
            </div>
          ))}
        </div>
      )}

      {/* Smart Modal for Bank Selection */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 md:p-8 w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-bl-full -z-10"></div>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-white">Select a Bank</h2>
                <p className="text-purple-400 text-sm font-medium mt-1 capitalize">in {selectedLocation.district?.toLowerCase()}, {selectedLocation.state?.toLowerCase()}</p>
              </div>
              <button onClick={() => setSelectedLocation(null)} className="text-slate-400 hover:text-red-400 text-3xl font-light transition-colors">&times;</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
              {ALL_BANKS.map(bank => (
                <button 
                  key={bank} 
                  onClick={() => router.push(`/ifsc-directory/${formatToSlug(bank)}/${formatToSlug(selectedLocation.state)}/${formatToSlug(selectedLocation.district)}`)}
                  className="bg-slate-800 p-3 rounded-lg border border-slate-700 hover:border-purple-500 hover:bg-slate-700 text-sm text-slate-300 hover:text-white transition-all text-left truncate"
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}