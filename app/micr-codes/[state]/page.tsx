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
    title: `${formattedState} Bank MICR Codes | Pincode Club`,
    description: `Complete list of bank branches and MICR codes in ${formattedState}.`,
  };
}

export default async function StateMicrPage({ params }: Props) {
  const resolvedParams = await params;
  const stateParam = resolvedParams.state || '';
  
  if (!stateParam) {
    notFound();
  }

  const stateQuery = '%' + stateParam.replace(/-/g, '%') + '%';

  const { data, error } = await supabase
    .from('micr_codes')
    .select('*')
    .ilike('state', stateQuery)
    .order('bank_name', { ascending: true })
    .limit(10000);

  if (error || !data || data.length === 0) {
    notFound();
  }

  const displayState = data[0].state.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-emerald-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/micr-codes" className="hover:text-emerald-500 transition-colors">MICR CODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{displayState}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          <span className="text-emerald-400">{displayState}</span> MICR CODES
        </h1>
        <p className="text-slate-300 text-lg">
          Complete directory of bank branches and 9-digit MICR codes for {displayState}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item: any, index: number) => {
          return (
            <div 
              key={index}
              className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col shadow-sm hover:border-emerald-500/50 transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-lg font-bold text-white line-clamp-2">
                  {item.bank_name}
                </span>
                <span className="bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-lg ml-3 flex-shrink-0 tracking-wider">
                  {item.micr_code}
                </span>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-800/50">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Branch</p>
                  <p className="text-sm text-emerald-400 font-bold truncate max-w-[150px]" title={item.branch_name}>
                    {item.branch_name || 'N/A'}
                  </p>
                </div>
                {item.address && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2" title={item.address}>{item.address}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}