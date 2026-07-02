import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Financial & Postal Guides | Pincode Club',
  description: 'Expert tutorials and guides on Indian Postal services, Banking procedures, and IFSC/MICR codes.',
};

export default function GuidesHubPage() {
  const categories = [
    {
      title: 'Postal Guides',
      desc: 'Everything about India Post, Speed Post tracking, and saving schemes.',
      icon: (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      color: 'hover:border-blue-500/50',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Banking Guides',
      desc: 'Step-by-step tutorials on banking procedures, account opening, and net banking.',
      icon: (
        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
      ),
      color: 'hover:border-cyan-500/50',
      bg: 'bg-cyan-500/10'
    },
    {
      title: 'IFSC & MICR Tutorials',
      desc: 'Learn how NEFT, RTGS, and IMPS work using bank codes for safe transfers.',
      icon: (
        <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      ),
      color: 'hover:border-sky-500/50',
      bg: 'bg-sky-500/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-12 min-h-screen">
      
      {/* Header Section */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
          Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Hub</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Your ultimate resource for navigating India's postal networks, understanding banking procedures, and mastering digital transactions.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className={`bg-slate-900/50 p-8 rounded-2xl border border-slate-800 transition-all cursor-pointer group ${cat.color}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${cat.bg}`}>
              {cat.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
              {cat.title}
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              {cat.desc}
            </p>
            <div className="mt-8 flex items-center text-sm font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
              VIEW GUIDES <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="py-16 text-center bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
        <p className="text-slate-400 text-lg font-medium">New articles and tutorials are being published soon. Stay tuned!</p>
      </div>

    </div>
  );
}