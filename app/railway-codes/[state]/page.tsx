import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ state: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const state = resolvedParams.state || '';
  const formattedState = state.replace(/-/g, ' ').toUpperCase();
  
  return {
    title: `${formattedState} Railway Station Codes | Pincode Club`,
    description: `Complete list of Railway Station codes and zones in ${formattedState}.`,
  };
}

export default async function StateRailwayPage({ params }: Props) {
  const resolvedParams = await params;
  const stateParam = resolvedParams.state || '';
  
  if (!stateParam) {
    notFound();
  }

  // Smart wildcard search to match exact database text
  const stateQuery = '%' + stateParam.replace(/-/g, '%') + '%';

  // Fetches up to 10000 rows to bypass Supabase's default 1000 row cutoff limit
  const { data, error } = await supabase
    .from('station_codes')
    .select('*')
    .ilike('state', stateQuery)
    .order('station_name', { ascending: true })
    .limit(10000);

  if (error || !data || data.length === 0) {
    notFound();
  }

  const displayState = data[0].state.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/railway-codes" className="hover:text-blue-500 transition-colors">RAILWAY CODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{displayState}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          <span className="text-red-400">{displayState}</span> RAILWAY STATIONS
        </h1>
        <p className="text-slate-300 text-lg">
          Complete directory of Indian Railways station codes and locations for {displayState}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item: any, index: number) => {
          return (
            <div 
              key={index}
              className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col shadow-sm hover:border-red-500/50 transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-bold text-white line-clamp-2">
                  {item.station_name}
                </span>
                <span className="bg-red-500 text-white font-extrabold px-3 py-1 rounded-lg ml-3 flex-shrink-0">
                  {item.station_code}
                </span>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800/50">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Railway Zone</p>
                  <p className="text-sm text-red-400 font-bold">{item.zone || 'N/A'}</p>
                </div>
                {item.address && (
                  <p className="text-xs text-slate-400 mt-2 truncate" title={item.address}>{item.address}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}