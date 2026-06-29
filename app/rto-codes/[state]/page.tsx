import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 🚀 Next.js 15 Fix for State Page
type Props = {
  params: Promise<{ state: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const formattedState = resolvedParams.state.replace(/-/g, ' ').toUpperCase();
  return {
    title: `${formattedState} RTO Codes Directory | Pincode Club`,
    description: `Complete list of RTO vehicle registration codes for ${formattedState}.`,
  };
}

export default async function StateRtoPage({ params }: Props) {
  const resolvedParams = await params;
  const stateQuery = resolvedParams.state.replace(/-/g, ' ');

  const { data, error } = await supabase
    .from('rto_codes')
    .select('*')
    .ilike('state', stateQuery)
    .order('regno', { ascending: true });

  if (error || !data || data.length === 0) {
    notFound();
  }

  const displayState = data[0].state.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/rto-codes" className="hover:text-blue-500 transition-colors">RTO CODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{displayState}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          <span className="text-amber-400">{displayState}</span> RTO CODES
        </h1>
        <p className="text-slate-300 text-lg">
          Complete directory of vehicle registration passing locations and RTO office details for {displayState}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item: any, index: number) => {
          // 🚀 Direct link to individual code page
          const codeLink = item.regno ? `/rto-codes/code/${encodeURIComponent(item.regno)}` : '#';
          
          return (
            <Link 
              href={codeLink}
              key={index}
              className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col shadow-sm group hover:border-amber-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                  {item.place}
                </span>
                <span className="bg-amber-500 text-slate-900 font-extrabold px-3 py-1 rounded-lg ml-3 flex-shrink-0">
                  {item.regno}
                </span>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Registration State</p>
                <p className="text-sm text-amber-500 font-medium">{item.state.toUpperCase()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}