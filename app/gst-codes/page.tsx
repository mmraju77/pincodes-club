'use client';

import Link from 'next/link';
import { useLanguage, translateName } from '@/src/context/LanguageContext';
import { useState, useMemo } from 'react';

const GST_STATE_CODES = [
  { code: '01', state: 'Jammu and Kashmir', type: 'State' },
  { code: '02', state: 'Himachal Pradesh', type: 'State' },
  { code: '03', state: 'Punjab', type: 'State' },
  { code: '04', state: 'Chandigarh', type: 'Union Territory' },
  { code: '05', state: 'Uttarakhand', type: 'State' },
  { code: '06', state: 'Haryana', type: 'State' },
  { code: '07', state: 'Delhi', type: 'Union Territory' },
  { code: '08', state: 'Rajasthan', type: 'State' },
  { code: '09', text: 'Uttar Pradesh', state: 'Uttar Pradesh', type: 'State' },
  { code: '10', state: 'Bihar', type: 'State' },
  { code: '11', state: 'Sikkim', type: 'State' },
  { code: '12', state: 'Arunachal Pradesh', type: 'State' },
  { code: '13', state: 'Nagaland', type: 'State' },
  { code: '14', state: 'Manipur', type: 'State' },
  { code: '15', state: 'Mizoram', type: 'State' },
  { code: '16', state: 'Tripura', type: 'State' },
  { code: '17', state: 'Meghalaya', type: 'State' },
  { code: '18', state: 'Assam', type: 'State' },
  { code: '19', state: 'West Bengal', type: 'State' },
  { code: '20', state: 'Jharkhand', type: 'State' },
  { code: '21', state: 'Odisha', type: 'State' },
  { code: '22', state: 'Chhattisgarh', type: 'State' },
  { code: '23', state: 'Madhya Pradesh', type: 'State' },
  { code: '24', state: 'Gujarat', type: 'State' },
  { code: '26', state: 'Dadra and Nagar Haveli and Daman and Diu', type: 'Union Territory' },
  { code: '27', state: 'Maharashtra', type: 'State' },
  { code: '29', state: 'Karnataka', type: 'State' },
  { code: '30', state: 'Goa', type: 'State' },
  { code: '31', state: 'Lakshadweep', type: 'Union Territory' },
  { code: '32', state: 'Kerala', type: 'State' },
  { code: '33', state: 'Tamil Nadu', type: 'State' },
  { code: '34', state: 'Puducherry', type: 'Union Territory' },
  { code: '35', state: 'Andaman and Nicobar Islands', type: 'Union Territory' },
  { code: '36', state: 'Telangana', type: 'State' },
  { code: '37', state: 'Andhra Pradesh', type: 'State' },
  { code: '38', state: 'Ladakh', type: 'Union Territory' }
];

export default function GSTCodesPage() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCodes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return GST_STATE_CODES.filter(item => 
      item.state.toLowerCase().includes(q) || item.code.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-orange-500 transition-colors">{t.home || "Home"}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium">GST State Codes</span>
      </nav>

      {/* Header section */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold tracking-wide uppercase">
              Taxation Utility
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              GST State Codes List
            </h1>
            <p className="text-slate-300 text-base font-light max-w-xl">
              Official two-digit state code prefixes used in Indian GSTIN structures for invoices and registration verification.
            </p>
          </div>
          
          <div className="w-full md:w-72 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search State or Code..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Codes Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((item, index) => (
            <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-bl-full -z-10"></div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors capitalize">
                  {translateName(item.state.toLowerCase(), language)}
                </h3>
                <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-lg font-black text-xl shadow-sm tracking-wider shrink-0">
                  {item.code}
                </span>
              </div>
              
              <div className="mt-auto pt-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded-md">
                  {item.type}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-400 text-lg">No records found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}