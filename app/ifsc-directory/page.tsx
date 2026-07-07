'use client';

import Link from 'next/link';
import { useState } from 'react';

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
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export default function IfscDirectoryHub() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBanks = ALL_BANKS.filter(bank => 
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12 flex flex-col min-h-screen">
      
      {/* Header Section */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold tracking-widest uppercase">IFSC Directory Hub</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">India Bank Routing Center</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">Follow the path: Bank ➔ State ➔ District ➔ City ➔ Branch to find verified live IFSC records.</p>
        
        <div className="max-w-xl mx-auto relative">
          <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search for your Bank name here..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition-colors shadow-inner font-medium"
          />
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-emerald-500 pl-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group">
             <div className="text-3xl mb-2">🏦</div>
             <h3 className="text-white font-bold mb-1">Search by Bank</h3>
             <p className="text-slate-400 text-xs">Select a bank below to start.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group">
             <div className="text-3xl mb-2">🗺️</div>
             <h3 className="text-white font-bold mb-1">Search by State</h3>
             <p className="text-slate-400 text-xs">Available after selecting a Bank.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group">
             <div className="text-3xl mb-2">🏢</div>
             <h3 className="text-white font-bold mb-1">Search by District</h3>
             <p className="text-slate-400 text-xs">Available after selecting a State.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 text-center relative overflow-hidden group">
             <div className="text-3xl mb-2">🏙️</div>
             <h3 className="text-white font-bold mb-1">Popular Cities</h3>
             <p className="text-slate-400 text-xs">Scroll down for quick links.</p>
          </div>
        </div>
      </section>

      {/* ALL BANKS GRID */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">All Indian Banks</h2>
          <span className="text-slate-500 text-sm">{filteredBanks.length} Banks Found</span>
        </div>
        
        {filteredBanks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredBanks.map((bankName, index) => {
              const slug = formatToSlug(bankName);
              return (
                <Link href={`/ifsc-directory/${slug}`} key={index} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all flex flex-col items-center justify-center text-center group">
                  <div className="text-2xl mb-2 opacity-80 group-hover:opacity-100 transition-opacity">🏦</div>
                  <h3 className="text-slate-200 font-semibold text-sm group-hover:text-blue-400 transition-colors">{bankName}</h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-900/30 rounded-2xl border border-slate-800">
            <p className="text-slate-400">No banks found matching "{searchTerm}"</p>
          </div>
        )}
      </section>

      {/* Popular Cities Links */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-purple-500 pl-4">Direct Popular City Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_CITIES.map((city, index) => (
            <Link 
              href={`/ifsc-directory/${city.bank}/${city.state}/${city.dist}/${city.city}`} 
              key={index} 
              className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 hover:border-purple-500 hover:bg-slate-800 transition-all flex items-center justify-between group"
            >
              <div>
                <h3 className="text-white font-bold group-hover:text-purple-400">{city.name}</h3>
                <p className="text-xs text-slate-500 uppercase">{city.bank.replace(/-/g, ' ')}</p>
              </div>
              <span className="text-slate-500 group-hover:text-purple-400">➔</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}