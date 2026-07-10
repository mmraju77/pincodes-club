// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase'; // Ensure this path matches your supabase config

const formatToSlug = (text) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const formatBankAcronyms = (str) => {
  if (!str) return '';
  let result = str.replace(/\b\w/g, l => l.toUpperCase());
  const acronyms = ['RTGS', 'NEFT', 'IMPS', 'SWIFT', 'MICR', 'UPI', 'IFSC', 'SBI', 'HDFC', 'ICICI'];
  acronyms.forEach(acronym => {
      const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
      result = result.replace(regex, acronym.toUpperCase());
  });
  return result;
};

export default function IfscSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time Debounced Search Query to Supabase
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim().length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        const searchTerm = `%${query.trim()}%`;
        
        // Smart Query: Searches in Bank, Branch, City, or Exact IFSC
        const { data, error } = await supabase
          .from('ifsc_codes')
          .select('*')
          .or(`ifsc.ilike."${searchTerm}",bank.ilike."${searchTerm}",branch.ilike."${searchTerm}",city.ilike."${searchTerm}"`)
          .limit(6);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Search query error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 300ms delay to prevent crashing database with too many requests (Debounce)
    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-50" ref={searchRef}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 text-xl">🔍</div>
        <input
          type="text"
          className="w-full bg-slate-900/80 border-2 border-slate-700 focus:border-blue-500 text-white placeholder-slate-400 rounded-2xl py-4 pl-12 pr-4 shadow-xl transition-all outline-none text-lg"
          placeholder="Search by Bank Name, Branch, City, or IFSC Code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => query.length >= 3 && setIsOpen(true)}
        />
        {isLoading && (
          <div className="absolute right-4 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {/* Smart Dropdown Results */}
      {isOpen && query.length >= 3 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {results.length > 0 ? (
            results.map((res, index) => {
              // Master Routing URL Generation (Matches your dynamic slug architecture perfectly)
              const resultUrl = `/ifsc-directory/${formatToSlug(res.bank)}/${formatToSlug(res.state)}/${formatToSlug(res.district)}/${formatToSlug(res.city)}/${formatToSlug(res.branch)}`;
              
              return (
                <Link 
                  href={resultUrl} 
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="flex flex-col pr-4">
                    <span className="text-white font-bold text-base group-hover:text-blue-400 transition-colors" translate="no">
                      {formatBankAcronyms((res.bank || '').toLowerCase())} - {formatBankAcronyms((res.branch || '').toLowerCase())}
                    </span>
                    <span className="text-slate-400 text-xs mt-1" translate="no">
                      📍 {formatBankAcronyms((res.city || '').toLowerCase())}, {formatBankAcronyms((res.state || '').toLowerCase())}
                    </span>
                  </div>
                  <div className="shrink-0">
                    <span className="bg-blue-900/50 text-blue-300 border border-blue-700/50 px-3 py-1 rounded-lg text-xs font-bold tracking-wider">
                      {res.ifsc}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            !isLoading && (
              <div className="p-6 text-center text-slate-400">
                No active records found for "{query}". Try checking the spelling.
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}