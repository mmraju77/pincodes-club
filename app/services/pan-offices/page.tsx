// @ts-nocheck
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdBanner from '@/components/AdBanner';
import SponsorCard from '@/components/SponsorCard';

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function PanOfficesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const queryText = searchTerm.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    if (!queryText) return;
    
    setIsSearching(true);
    setResults([]);
    setErrorMsg('');
    setHasSearched(true);

    try {
      // Searching by City or Pincode in the pancard_centers table
      const { data, error } = await supabase
        .from('pancard_centers')
        .select('*')
        .or(`city.ilike.%${queryText}%,pincode.ilike.%${queryText}%`)
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setResults(data);
      } else {
        setErrorMsg(`No PAN Card centers found for "${queryText}". Try searching by a nearby City or Pincode.`);
      }
    } catch (err: any) {
      console.error("Search Error:", err);
      setErrorMsg('Database connection error. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 min-h-screen">
      
      {/* Top Ad Placement */}
      <AdBanner placeholder="Top Sponsored Advertisement" />

      {/* Header Section */}
      <div className="text-center space-y-4 mb-12 mt-8">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-2xl mb-2">
          <span className="text-6xl drop-shadow-md">💳</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Authorized <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">PAN Card Centers</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Find NSDL and UTIITSL authorized PAN Card offices near you. Search by your City or Pincode.
        </p>
      </div>

      {/* Search Module */}
      <div className="bg-[#0f172a] p-6 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden mb-16 max-w-4xl mx-auto">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <form onSubmit={handleSearch} className="relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value.trim() === '') setHasSearched(false);
                }}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border-2 border-slate-700 focus:border-emerald-500 rounded-xl text-white font-medium outline-none transition-all shadow-inner placeholder-slate-500"
                placeholder="Enter City Name (e.g., Mangalore) or Pincode"
                autoComplete="off"
                spellCheck="false"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-lg font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${isSearching ? 'opacity-75 cursor-wait' : 'hover:-translate-y-1'}`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Searching...
                </>
              ) : 'Find Centers'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-semibold mb-8 animate-fade-in-up max-w-4xl mx-auto">
          {errorMsg}
        </div>
      )}

      {/* Results Section */}
      {hasSearched && results.length > 0 && (
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Found {results.length} PAN Centers
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            
            {/* Affiliate Sponsor Card */}
            <div className="lg:col-span-1 h-fit sticky top-24">
              <SponsorCard 
                title="Get Business Loan up to ₹10 Lakhs" 
                description="Fast approval, minimal documentation, and attractive interest rates for PAN Card holders." 
                link="https://www.google.com" 
                buttonText="Apply Now" 
              />
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((item, index) => (
                <div key={index} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col h-full">
                  
                  <div className="flex justify-between items-start mb-4 border-b border-slate-700/50 pb-4">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 block">
                        {item.facilitator || 'Authorized Agency'}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-tight">
                        {toTitleCase(item.city)}
                      </h3>
                    </div>
                    <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-center">
                      <span className="text-sm text-slate-300 font-bold">{item.pincode}</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-3">
                    {item.branch && (
                      <div>
                        <span className="block text-xs text-slate-500 uppercase">Branch / Center</span>
                        <span className="text-sm text-slate-300">{item.branch}</span>
                      </div>
                    )}
                    {item.contactperson && (
                      <div>
                        <span className="block text-xs text-slate-500 uppercase">Contact Person</span>
                        <span className="text-sm text-slate-300">{toTitleCase(item.contactperson)}</span>
                      </div>
                    )}
                    {item.contactaddress && (
                      <div>
                        <span className="block text-xs text-slate-500 uppercase">Address</span>
                        <span className="text-sm text-slate-300 leading-relaxed">{item.contactaddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Contact Info Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-700/50 grid grid-cols-1 gap-2">
                    {item.contactnumber && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {item.contactnumber}
                      </div>
                    )}
                    {item.emailaddress && (
                      <div className="flex items-center gap-2 text-sm text-slate-400 break-all">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <a href={`mailto:${item.emailaddress}`} className="hover:text-emerald-400 transition-colors">
                          {item.emailaddress}
                        </a>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Ad Placement */}
      <AdBanner placeholder="Bottom Display Advertisement" />

    </div>
  );
}