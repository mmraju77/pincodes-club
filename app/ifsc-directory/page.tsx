'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

// Massive list of all Indian Banks
const ALL_BANKS = [
  "Abhyudaya Co-operative Bank", "Aditya Birla Idea Payments Bank", "Airtel Payments Bank", "Allahabad Bank", "Andhra Bank",
  "Andhra Pragathi Grameena Bank", "Apna Sahakari Bank", "Axis Bank", "Bandhan Bank", "Bank of America",
  "Bank of Bahrein and Kuwait", "Bank of Baroda", "Bank of Ceylon", "Bank of India", "Bank of Maharashtra",
  "Barclays Bank", "Bassein Catholic Co-operative Bank", "Canara Bank", "Capital Small Finance Bank", "Catholic Syrian Bank",
  "Central Bank of India", "Chaitanya Godavari Grameena Bank", "Citi Bank", "City Union Bank", "Corporation Bank",
  "Cosmos Co-operative Bank", "CSB Bank", "DBS Bank", "DCB Bank", "Dena Bank",
  "Deutsche Bank", "Dhanlaxmi Bank", "Equitas Small Finance Bank", "ESAF Small Finance Bank", "Federal Bank",
  "Fincare Small Finance Bank", "HDFC Bank", "HSBC Bank", "ICICI Bank", "IDBI Bank",
  "IDFC First Bank", "Indian Bank", "Indian Overseas Bank", "Indusind Bank", "Jana Small Finance Bank",
  "Jammu and Kashmir Bank", "Jio Payments Bank", "Karnataka Bank", "Karnataka Vikas Grameena Bank", "Karur Vysya Bank",
  "Kotak Mahindra Bank", "Maharashtra Gramin Bank", "Nainital Bank", "Paytm Payments Bank", "Punjab and Sind Bank",
  "Punjab National Bank", "RBL Bank", "Saptagiri Grameena Bank", "South Indian Bank", "Standard Chartered Bank",
  "State Bank of India", "Syndicate Bank", "Tamilnad Mercantile Bank", "Telangana Grameena Bank", "UCO Bank",
  "Union Bank of India", "United Bank of India", "Utkarsh Small Finance Bank", "Yes Bank"
];

const POPULAR_CITIES = [
  { name: "Hyderabad", bank: "state-bank-of-india", state: "telangana", dist: "hyderabad", city: "hyderabad" },
  { name: "Visakhapatnam", bank: "state-bank-of-india", state: "andhra-pradesh", dist: "visakhapatnam", city: "visakhapatnam" },
  { name: "Bengaluru", bank: "hdfc-bank", state: "karnataka", dist: "bangalore", city: "bangalore" },
  { name: "Chennai", bank: "icici-bank", state: "tamil-nadu", dist: "chennai", city: "chennai" },
  { name: "Mumbai", bank: "axis-bank", state: "maharashtra", dist: "mumbai", city: "mumbai" },
  { name: "Delhi", bank: "punjab-national-bank", state: "delhi", dist: "new-delhi", city: "new-delhi" }
];

const formatToSlug = (text: string) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const buildBranchUrl = (row: any) => {
  const b = formatToSlug(row.bank);
  const s = formatToSlug(row.state);
  const d = formatToSlug(row.district);
  const c = formatToSlug(row.city || row.centre);
  const br = formatToSlug(row.branch);
  return `/ifsc-directory/${b}/${s}/${d}/${c}/${br}`;
};

export default function IfscDirectoryHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchingDB, setIsSearchingDB] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchGlobalSearch = async () => {
      if (debouncedTerm.length >= 3) {
        setIsSearchingDB(true);
        setShowDropdown(true);
        setSearchError(null);
        
        try {
          let searchString = debouncedTerm.trim().toLowerCase();

          const acronyms: Record<string, string> = {
            'sbi': 'state bank of india',
            'hdfc': 'hdfc bank',
            'icici': 'icici bank',
            'pnb': 'punjab national bank',
            'bob': 'bank of baroda',
            'boi': 'bank of india',
            'cbi': 'central bank of india',
            'iob': 'indian overseas bank',
            'bom': 'bank of maharashtra',
            'ubi': 'union bank of india',
            'rbl': 'rbl bank'
          };

          for (const [key, value] of Object.entries(acronyms)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            searchString = searchString.replace(regex, value);
          }

          const words = searchString.split(/\s+/).filter(w => w.length > 0);
          let dataToUse: any[] = [];

          const { data, error } = await supabase.rpc('search_ifsc_smart', { 
            search_words: words 
          });

          if (error) {
            console.warn("Smart search RPC failed or missing, using robust fallback...");
            let q = supabase.from('ifsc_codes').select('bank, state, district, city, centre, branch, ifsc');
            words.forEach(word => {
              const safeWord = word.replace(/"/g, '');
              const sq = `%${safeWord}%`;
              q = q.or(`ifsc.ilike."${sq}",bank.ilike."${sq}",branch.ilike."${sq}",city.ilike."${sq}",centre.ilike."${sq}",district.ilike."${sq}"`);
            });
            const fallbackRes = await q.limit(10);
            if (fallbackRes.data) dataToUse = fallbackRes.data;
          } else {
            dataToUse = data || [];
          }

          setSearchResults(dataToUse);
          
        } catch (err: any) {
          console.error("Search Architecture Error:", err.message);
          setSearchError("Unable to fetch data. Please try again.");
          setSearchResults([]);
        } finally {
          setIsSearchingDB(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    };

    fetchGlobalSearch();
  }, [debouncedTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBanks = ALL_BANKS.filter(bank => 
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12 flex flex-col min-h-screen scroll-smooth">
      
      {/* Search Header Section */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl text-center relative overflow-visible z-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-t-3xl"></div>
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mt-4">IFSC Directory Hub</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">India Bank Routing Center</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">Search instantly by Bank Name, Branch, City, District, or IFSC Code.</p>
        
        <div className="max-w-2xl mx-auto relative text-left" ref={searchContainerRef}>
          <svg className="w-6 h-6 absolute left-4 top-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search e.g., 'SBI Gajuwaka', 'HDFC Mumbai', 'SBIN0001234'..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length >= 3) setShowDropdown(true);
            }}
            onFocus={() => { if (searchTerm.length >= 3) setShowDropdown(true); }}
            className="w-full bg-slate-900 border-2 border-slate-600 text-white rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-all shadow-lg font-medium text-lg"
          />
          
          {showDropdown && searchTerm.length >= 3 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
              {isSearchingDB ? (
                <div className="p-6 text-center flex flex-col items-center justify-center space-y-3">
                   <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-slate-400 font-medium">Running Smart AI Scan...</p>
                </div>
              ) : searchError ? (
                <div className="p-6 text-center text-red-400 font-medium">{searchError}</div>
              ) : searchResults.length > 0 ? (
                <div className="flex flex-col">
                  <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                    Top Matches Found
                  </div>
                  {searchResults.map((res, i) => (
                    <Link 
                      href={buildBranchUrl(res)} 
                      key={i} 
                      onClick={() => setShowDropdown(false)}
                      className="p-4 border-b border-slate-700 hover:bg-blue-600/10 flex flex-col transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-1 gap-4">
                         <span className="text-blue-400 font-bold capitalize text-lg group-hover:text-blue-300 transition-colors" translate="no">{res.bank?.toLowerCase()}</span>
                         <span className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-black tracking-widest shrink-0 shadow-sm">{res.ifsc}</span>
                      </div>
                      <span className="text-white text-base font-semibold capitalize mb-1" translate="no">{res.branch?.toLowerCase()}</span>
                      <span className="text-slate-400 text-sm capitalize flex items-center gap-1" translate="no">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {(res.city || res.centre)?.toLowerCase()}, {res.district?.toLowerCase()}, {res.state?.toLowerCase()}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-slate-300 font-bold text-lg mb-1">No matches found</p>
                  <p className="text-slate-500 text-sm">Try searching with a different branch name, city, or IFSC code.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-emerald-500 pl-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="#banks-section" className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group cursor-pointer hover:border-blue-500 transition-all shadow-md hover:shadow-blue-900/20">
             <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏦</div>
             <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">Search by Bank</h3>
             <p className="text-slate-400 text-xs">Scroll to all banks.</p>
          </Link>
          
          <Link href="/ifsc-directory/states" className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group cursor-pointer hover:border-blue-500 transition-all shadow-md hover:shadow-blue-900/20">
             <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🗺️</div>
             <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">Search by State</h3>
             <p className="text-slate-400 text-xs">View all Indian States.</p>
          </Link>
          
          <Link href="/ifsc-directory/districts" className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group cursor-pointer hover:border-blue-500 transition-all shadow-md hover:shadow-blue-900/20">
             <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏢</div>
             <h3 className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">Search by District</h3>
             <p className="text-slate-400 text-xs">Search 700+ Districts.</p>
          </Link>
          
          <Link href="#cities-section" className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group cursor-pointer hover:border-purple-500 transition-all shadow-md hover:shadow-purple-900/20">
             <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏙️</div>
             <h3 className="text-white font-bold mb-1 group-hover:text-purple-400 transition-colors">Popular Cities</h3>
             <p className="text-slate-400 text-xs">Scroll down for quick links.</p>
          </Link>
        </div>
      </section>

      {/* EXPERT FIX: Applied Premium Path Logic UI to Bank Cards */}
      <section id="banks-section" className="relative z-10 scroll-mt-24">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">All Indian Banks</h2>
          <span className="text-slate-500 text-sm font-medium">{filteredBanks.length} Banks</span>
        </div>
        
        {filteredBanks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBanks.map((bankName, index) => {
              const slug = formatToSlug(bankName);
              return (
                <Link href={`/ifsc-directory/${slug}`} key={index} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 transition-all flex flex-col items-center justify-center text-center group shadow-md hover:scale-[1.02]">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏦</div>
                  <h3 className="text-white font-bold text-sm capitalize group-hover:text-blue-400 transition-colors" translate="no">{bankName.toLowerCase()}</h3>
                  <span className="text-slate-500 text-xs mt-3 group-hover:text-blue-400 transition-colors">Explore States ➔</span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </section>

      {/* EXPERT FIX: Applied Premium Path Logic UI to Popular City Links */}
      <section id="cities-section" className="relative z-10 scroll-mt-24">
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Direct Popular City Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_CITIES.map((city, index) => (
            <Link 
              href={`/ifsc-directory/${city.bank}/${city.state}/${city.dist}/${city.city}`} 
              key={index} 
              className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 hover:border-purple-500 transition-all flex items-center justify-between group shadow-md hover:scale-[1.02]"
            >
              <div>
                <h3 className="text-white font-bold text-lg capitalize group-hover:text-purple-400 transition-colors">{city.name}</h3>
                <p className="text-xs text-slate-500 uppercase mt-1 tracking-wider">{city.bank.replace(/-/g, ' ')}</p>
              </div>
              <span className="text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-transform text-xl">➔</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}