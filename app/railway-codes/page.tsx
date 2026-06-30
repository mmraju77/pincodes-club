import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import RailwayClientList from './RailwayClientList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All India Railway Station Codes Directory | Pincode Club',
  description: 'Search Indian Railways station codes, station names, railway zones, and locations instantly.',
  keywords: 'railway station codes, irctc codes, indian railways codes, station directory',
};

export default async function RailwayDirectoryPage() {
  const { data: stationData, error } = await supabase
    .from('station_codes')
    .select('*')
    .order('station_name', { ascending: true })
    .limit(5000);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">RAILWAY CODES</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          All India Railway Station Codes
        </h1>
        <p className="text-slate-300 text-lg">
          Find official Indian Railways station codes, railway zones, and locations.
        </p>
      </div>

      {error ? (
        <div className="p-8 border border-red-500/30 bg-red-500/10 rounded-xl text-center">
          <p className="text-red-400 font-semibold">Database Error: {error.message}</p>
        </div>
      ) : (
        <RailwayClientList stationData={stationData || []} />
      )}
    </div>
  );
}