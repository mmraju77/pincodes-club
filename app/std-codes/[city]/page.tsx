import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

type Props = {
  params: Promise<{ city: string }>;
};

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const cityName = decodeURIComponent(resolvedParams.city).replace(/-/g, ' ').toUpperCase();

  return {
    title: `${cityName} STD Code - Official Landline Code | Pincode Club`,
    description: `The official STD code for ${cityName} is available here. Find correct landline dialing codes and telecommunication details for ${cityName}.`,
    keywords: `${cityName} std code, std code of ${cityName}, ${cityName} landline code, telecommunication`,
    alternates: {
      canonical: `https://pincodes-club.com/std-codes/${resolvedParams.city}`,
    }
  };
}

// 2. SERVER COMPONENT
export default async function CityStdCodePage({ params }: Props) {
  const resolvedParams = await params;
  const urlCityName = decodeURIComponent(resolvedParams.city).replace(/-/g, ' ');

  // Fetch the specific STD code
  
  const { data: stdData, error } = await supabase
    .from('std_codes')
    .select('*')
    .ilike('CITY', urlCityName)
    .limit(1)
    .single();

  const code = stdData?.CODE || stdData?.code || 'N/A';
  const cityName = stdData?.CITY || stdData?.city || urlCityName.toUpperCase();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/std-codes" className="hover:text-blue-500 transition-colors">STD CODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{cityName}</span>
      </nav>

      <div className="bg-slate-900/80 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col items-center text-center mt-10">
        <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
        
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2 capitalize">
          {cityName.toLowerCase()}
        </h1>
        <p className="text-slate-400 text-lg mb-8 uppercase tracking-widest font-semibold">STD Code</p>

        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-inner">
          <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-300 tracking-tighter">
            0{code}
          </div>
        </div>

        <p className="mt-8 text-slate-500 text-sm max-w-lg">
          To make a landline call to <span className="text-slate-300 capitalize">{cityName.toLowerCase()}</span> from within India, 
          prefix the local phone number with <strong className="text-slate-300">0{code}</strong>.
        </p>
      </div>
    </div>
  );
}