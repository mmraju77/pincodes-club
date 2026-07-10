// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';

const formatToSlug = (text) => {
  if (!text) return '';
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const formatBankAcronyms = (str) => {
  if (!str) return '';
  let result = str.replace(/\b\w/g, l => l.toUpperCase());
  const acronyms = ['RTGS', 'NEFT', 'IMPS', 'SWIFT', 'MICR', 'UPI', 'IFSC', 'SBI', 'HDFC', 'ICICI', 'PNB', 'BOB'];
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        let searchString = query.toLowerCase().trim();

        const acronyms = {
          'sbi': 'state bank of india',
          'hdfc': 'hdfc bank',
          'icici': 'icici bank',
          'pnb': 'punjab national',
          'bob': 'bank of baroda',
          'boi': 'bank of india',
          'ubi': 'union bank',
          'iob': 'indian overseas',
          'cbi': 'central bank',
          'bom': 'bank of maharashtra',
          'rbl': 'rbl bank'
        };

        let resolvedBankName = '';

        // 🚨 MASTER FIX 1: Map the exact bank name if an acronym is typed
        Object.keys(acronyms).forEach(key => {
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          if (searchString.match(regex)) {
             resolvedBankName = acronyms[key];
          }
          searchString = searchString.replace(regex, acronyms[key]);
        });

        searchString = searchString.replace(/\bbranch\b/g, ' ').replace(/\bbank\b/g, ' ');
        const words = searchString.split(/\s+/).filter(w => w.length > 0);

        let q = supabase.from('ifsc_codes').select('*');

        // 🚨 MASTER FIX 2: Strict Multi-Token Matcher (AND logic)
        // If a specific bank is identified (e.g., user typed SBI), strictly lock the query to that bank
        if (resolvedBankName) {
            q = q.ilike('bank', `%${resolvedBankName}%`);
            // The remaining words MUST be in the branch or city (prevents showing all SBI branches)
            words.forEach(word => {
                if (!resolvedBankName.includes(word)) {
                   q = q.or(`branch.ilike.%${word}%,city.ilike.%${word}%,centre.ilike.%${word}%,district.ilike.%${word}%`);
                }
            });
        } else {
            // If no specific bank acronym is typed, enforce that ALL words must exist somewhere in the row
            words.forEach(word => {
                q = q.or(`ifsc.ilike.%${word}%,bank.ilike.%${word}%,branch.ilike.%${word}%,city.ilike.%${word}%,centre.ilike.%${word}%,district.ilike.%${word}%`);
            });
        }

        const { data, error } = await q.limit(10); // Show top 10 accurate results

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Search query error:", error);
      } finally {
        setIsLoading(false);
      }
    };

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
          className="w-full bg-slate-900/80 border-2 border-slate-700 focus:border-blue-500 text-white placeholder-slate-400 rounded-2xl py-4 pl-12 pr-4 shadow-xl transition-all outline-none text-lg font-medium tracking-wide"
          placeholder="Search e.g., 'sbi gajuwaka', 'hdfc mumbai' or 'SBIN000...'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => query.length >= 3 && setIsOpen(true)}
        />
        {isLoading && (
          <div className="absolute right-4 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      {isOpen && query.length >= 3 && (
        <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col custom-scrollbar max-h-[400px] overflow-y-auto">
          {results.length > 0 ? (
            results.map((res, index) => {
              const resultUrl = `/ifsc-directory/${formatToSlug(res.bank)}/${formatToSlug(res.state)}/${formatToSlug(res.district)}/${formatToSlug(res.city)}/${formatToSlug(res.branch)}`;
              
              return (
                <Link 
                  href={resultUrl} 
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-700/50 hover:bg-slate-700/80 transition-colors group gap-3"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-white font-extrabold text-base group-hover:text-blue-400 transition-colors" translate="no">
                      {formatBankAcronyms((res.bank || '').toLowerCase())} - {formatBankAcronyms((res.branch || '').toLowerCase())}
                    </span>
                    <span className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-semibold" translate="no">
                      📍 {formatBankAcronyms((res.city || res.centre || '').toLowerCase())}, {formatBankAcronyms((res.district || '').toLowerCase())}, {formatBankAcronyms((res.state || '').toLowerCase())}
                    </span>
                  </div>
                  <div className="shrink-0 self-start sm:self-center">
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-black tracking-widest shadow-md">
                      {res.ifsc}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            !isLoading && (
              <div className="p-8 text-center">
                 <div className="text-4xl mb-3 opacity-50">🔍</div>
                 <p className="text-slate-300 font-bold text-lg mb-1">No matches found</p>
                 <p className="text-slate-500 text-sm">Try searching with a different bank or city name.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}