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
    title: `${stateName} RTO Codes & Vehicle Registration List | Pincode Club`,
    description: `Complete list of RTO codes for ${stateName}. Find accurate vehicle registration passing details and RTO office locations across all districts in ${stateName}.`,
    keywords: `${stateName} rto codes, ${stateName} vehicle registration, rto office ${stateName}, number plate codes ${stateName}`,
    alternates: {
      canonical: `https://pincodes-club.com/rto-codes/${resolvedParams.state}`,
    }
  };
}

// 2. SERVER COMPONENT
export default async function StateRtoCodesPage({ params }: Props) {
  const resolvedParams = await params;
  const urlStateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ');

  // Fetch all RTO codes for the selected state
  const { data: rtoData, error } = await supabase
    .from('rto_codes')
    .select('*')
    .ilike('state', `%${urlStateName}%`)
    .order('regno', { ascending: true });

  const displayStateName = rtoData && rtoData.length > 0 ? rtoData[0].state : urlStateName.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-amber-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/rto-codes" className="hover:text-amber-500 transition-colors">RTO CODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{displayStateName}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-[100px] -z-10"></div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 uppercase">
          {displayStateName} <span className="text-amber-400">RTO CODES</span>
        </h1>
        <p className="text-slate-300 text-lg">
          Complete directory of vehicle registration passing locations and RTO office details for <span className="font-bold text-white uppercase">{displayStateName}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rtoData && rtoData.length > 0 ? (
          rtoData.map((item: any, index: number) => {
            const regno = item.regno || 'N/A';
            const place = item.place || 'Unknown Location';
            
            return (
              <div 
                key={index}
                className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all flex flex-col relative shadow-xl group"
              >
                <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                  <div className="flex-1 pr-2">
                    <h3 className="text-lg font-bold text-slate-200 leading-snug">{place}</h3>
                  </div>
                  {/* Number Plate Design */}
                  <div className="flex flex-col items-end shrink-0">
                    <div className="bg-amber-400 text-black px-4 py-1.5 rounded-lg text-lg font-black tracking-widest border-2 border-black/20 shadow-md">
                      {regno}
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Registration State</span>
                  <p className="text-amber-400/80 font-medium text-sm mt-0.5 uppercase">{displayStateName}</p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-400 text-lg">No RTO codes found for this state.</p>
          </div>
        )}
      </div>
    </div>
  );
}