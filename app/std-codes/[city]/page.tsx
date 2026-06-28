import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export const metadata: Metadata = {
  title: 'All India STD Codes Directory | Pincode Club',
  description: 'Find official STD codes for all cities and towns across India. Complete telecommunication routing directory.',
  keywords: 'std codes india, indian std codes, city std codes, landline codes',
};

export default async function StdDirectoryPage() {
  // Fetch all cities and STD codes
  const { data: stdData, error } = await supabase
    .from('std_codes')
    .select('*')
    .order('city', { ascending: true }); // FIXED: Changed 'CITY' to 'city' to match SQL schema

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">STD CODES</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          All India STD Codes
        </h1>
        <p className="text-slate-300 text-lg">
          Select a city below to find its official telecommunication STD code.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stdData && stdData.length > 0 ? (
          stdData.map((item: any, index: number) => {
            // FIXED: Using lowercase 'city'
            const cityName = item.city;
            if (!cityName) return null;
            const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            return (
              <Link 
                href={`/std-codes/${citySlug}`} 
                key={index}
                className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between shadow-sm group hover:border-purple-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors capitalize truncate pr-2">
                  {cityName.toLowerCase()}
                </span>
                <span className="text-xs text-slate-500 group-hover:text-slate-300">➔</span>
              </Link>
            )
          })
        ) : (
          <p className="text-slate-400 col-span-full">No STD codes found or data is loading.</p>
        )}
      </div>
    </div>
  );
}