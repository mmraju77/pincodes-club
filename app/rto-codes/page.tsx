import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import RtoClientList from './RtoClientList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All India RTO Codes Directory | Pincode Club',
  description: 'Find official RTO vehicle registration codes for all states and cities across India. Complete RTO directory.',
  keywords: 'rto codes india, vehicle registration codes, rto directory, indian rto codes',
};

export default async function RtoDirectoryPage() {
  // Fetching all RTO data since Supabase limit is now 10,000
  const { data: rtoData, error } = await supabase
    .from('rto_codes')
    .select('*')
    .order('regno', { ascending: true })
    .limit(5000);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">RTO CODES</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          All India RTO Codes
        </h1>
        <p className="text-slate-300 text-lg">
          Search by vehicle registration code (e.g., TS09), city name, or state.
        </p>
      </div>

      {error ? (
        <div className="p-8 border border-red-500/30 bg-red-500/10 rounded-xl text-center">
          <p className="text-red-400 font-semibold">Database Error: {error.message}</p>
        </div>
      ) : (
        <RtoClientList rtoData={rtoData || []} />
      )}
    </div>
  );
}