import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

type Props = {
  params: Promise<{ state: string }>;
};

// 1. DYNAMIC SEO METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const stateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ').toUpperCase();

  return {
    title: `${stateName} Pincodes & Post Offices Directory | Pincode Club`,
    description: `Find all districts, post offices, and pincodes in ${stateName}. Accurate postal directory for delivery and non-delivery offices.`,
    keywords: `${stateName} pincodes, post offices in ${stateName}, postal codes India`,
    alternates: {
      canonical: `https://pincodes-club.com/pin-codes/${resolvedParams.state}`,
    }
  };
}

// 2. SERVER COMPONENT
export default async function PincodeStatePage({ params }: Props) {
  const resolvedParams = await params;
  const stateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ').toUpperCase();

  // Fetch unique districts matching the statename column
  const { data: districtData, error } = await supabase
    .from('pincodes')
    .select('district')
    .ilike('statename', `%${stateName}%`)
    .limit(10000);

  const uniqueDistricts = Array.from(new Set(districtData?.map(r => r.district).filter(Boolean))).sort();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/pin-codes" className="hover:text-blue-500 transition-colors">PINCODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{stateName}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 capitalize">
          Pincodes in {stateName.toLowerCase()}
        </h1>
        <p className="text-slate-300 text-lg">
          Select a district below to explore all post offices and their unique postal codes in <span className="font-bold text-emerald-400 capitalize">{stateName.toLowerCase()}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueDistricts.length > 0 ? (
          uniqueDistricts.map((districtName: any, index: number) => {
            const districtSlug = districtName.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link 
                href={`/pin-codes/${resolvedParams.state}/${districtSlug}`} 
                key={index}
                className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📍</div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 capitalize">
                  {districtName.toLowerCase()}
                </h3>
              </Link>
            )
          })
        ) : (
          <p className="text-slate-400">No districts found or data is loading.</p>
        )}
      </div>
    </div>
  );
}