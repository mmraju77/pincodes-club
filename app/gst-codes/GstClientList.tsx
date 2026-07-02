'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function GstClientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allData, setAllData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchGstData() {
      try {
        const { data, error } = await supabase
          .from('gst_codes')
          .select('*')
          .order('state_name', { ascending: true });
        
        if (error) throw error;
        
        if (isMounted && data) {
          setAllData(data);
        }
      } catch (error) {
        console.error("Error fetching GST codes:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    
    fetchGstData();
    return () => { isMounted = false; };
  }, []);

  const filteredResults = allData.filter((item) => {
    const query = searchTerm.toLowerCase().trim();
    const stateName = (item.state_name || '').toLowerCase();
    const stateCode = (item.state_code || '').toString();
    
    // Allows searching by "04" or "4" for Chandigarh
    const paddedCode = stateCode.padStart(2, '0');
    
    return stateName.includes(query) || stateCode.includes(query) || paddedCode.includes(query);
  });

  return (
    <div className="w-full space-y-8">
      <div className="relative max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          placeholder="Search by State Name or 2-Digit GST Code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-700 text-white rounded-full py-4 pl-14 pr-6 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-slate-500 shadow-xl text-lg"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {searchTerm ? 'Search Results' : 'All States & Union Territories'}
          </h2>
          <span className="text-sm font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
            {isLoading ? 'Loading...' : `${filteredResults.length} Found`}
          </span>
        </div>
        
        {isLoading ? (
          <div className="w-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-purple-400 text-lg animate-pulse font-medium">Fetching GST Codes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, index) => {
                const formattedCode = (item.state_code || '').toString().padStart(2, '0');

                return (
                  <div 
                    key={index}
                    className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col shadow-sm hover:border-purple-500/50 transition-all cursor-default group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded uppercase tracking-wider group-hover:text-purple-400 transition-colors">
                        GST CODE
                      </span>
                      <span className="text-2xl font-extrabold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20 shadow-sm">
                        {formattedCode}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-white line-clamp-2 mt-auto pt-4 border-t border-slate-800/50" title={item.state_name}>
                      {item.state_name}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-400 text-lg">No GST codes found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}