// @ts-nocheck
'use client';

import Link from 'next/link';
import { useState } from 'react';
import IfscSearchBar from '../../components/IfscSearchBar';

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

export default function IfscDirectoryHub() {
  // Local state just for filtering the big bank list below
  const [bankFilter, setBankFilter] = useState('');

  const filteredBanks = ALL_BANKS.filter(bank => 
    bank.toLowerCase().includes(bankFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12 flex flex-col min-h-screen scroll-smooth">
      
      {/* Search Header Section */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl text-center relative overflow-visible z-50">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-t-3xl"></div>
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase mt-4">IFSC Directory Hub</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">India Bank Routing Center</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">Search instantly by Bank Name, Branch, City, District, or IFSC Code.</p>
        
        {/* 🚨 INJECTED THE NEW STANDALONE SEARCH COMPONENT HERE 🚨 */}
        <IfscSearchBar />

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

      <section id="banks-section" className="relative z-10 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">All Indian Banks</h2>
            <span className="text-slate-500 text-sm font-medium ml-4">{filteredBanks.length} Banks</span>
          </div>
          {/* Mini-filter just for this bank grid */}
          <input 
            type="text" 
            placeholder="Filter bank list..." 
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:border-blue-500 transition-all text-sm w-full md:w-64"
          />
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
        ) : (
          <div className="text-center py-8 text-slate-400 border border-slate-800 rounded-xl bg-slate-900/40">
            No banks found matching "{bankFilter}".
          </div>
        )}
      </section>

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