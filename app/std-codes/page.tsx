import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import StdClientList from './StdClientList'; // 👈 Importing the Search component

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All India STD Codes Directory | Pincode Club',
  description: 'Find official STD codes for all cities and towns across India. Complete telecommunication routing directory.',
  keywords: 'std codes india, indian std codes, city std codes, landline codes',
};

export default async function StdDirectoryPage() {
  // Fetch data on the server
  const { data: stdData, error } = await supabase
    .from('std_codes')
    .select('city')
    .order('city', { ascending: true })
    .limit(4000);

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
          Select a city below or use the search bar to find its official telecommunication STD code.
        </p>
      </div>

      {/* 🚀 Passing data to our new Search Bar Component */}
      {error ? (
        <div className="p-8 border border-red-500/30 bg-red-500/10 rounded-xl text-center">
          <p className="text-red-400 font-semibold">Database Error: {error.message}</p>
        </div>
      ) : (
        <StdClientList stdData={stdData || []} />
      )}
    </div>
  );
}