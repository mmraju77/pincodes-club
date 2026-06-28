import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export const metadata: Metadata = {
  title: 'All India RTO Codes & Vehicle Registration Directory | Pincode Club',
  description: 'Find official RTO vehicle registration codes for all states and union territories in India. Check vehicle passing locations instantly.',
  keywords: 'rto codes india, vehicle registration codes, rto office codes, state rto list, number plate codes',
};

export default async function RtoDirectoryPage() {
  // Fetch all unique states from RTO table
  const { data, error } = await supabase
    .from('rto_codes')
    .select('state')
    .order('state', { ascending: true });

  const uniqueStates = Array.from(new Set(data?.map(r => r.state).filter(Boolean))).sort();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-amber-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">RTO CODES</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          All India RTO Codes Directory
        </h1>
        <p className="text-slate-300 text-lg">
          Select a state or union territory below to view all official vehicle registration (RTO) codes and their respective locations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uniqueStates.length > 0 ? (
          uniqueStates.map((stateName: any, index: number) => {
            const stateSlug = stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            
            return (
              <Link 
                href={`/rto-codes/${stateSlug}`} 
                key={index}
                className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center shadow-sm group hover:border-amber-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🚘</div>
                <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors uppercase">
                  {stateName}
                </span>
              </Link>
            )
          })
        ) : (
          <p className="text-slate-400 col-span-full">No states found or data is loading.</p>
        )}
      </div>
    </div>
  );
}