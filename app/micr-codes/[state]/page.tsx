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
    .from('ifsc_codes')
    .select('*')
    .ilike('state', stateQuery)
    .order('bank', { ascending: true })
    .limit(10000);

  if (error || !data || data.length === 0) {
    notFound();
  }

  const validData = data.filter((item: any) => {
    const m = item.micr || item.micr_code;
    return m && m !== 'NA' && m.trim() !== '';
  });

  if (validData.length === 0) {
    notFound();
  }

  const displayState = validData[0].state.toUpperCase();

  // 🚀 Advanced Grouping Logic: Groups all branches under their respective Bank Name
  const groupedByBank = validData.reduce((acc: any, item: any) => {
    const bankName = item.bank || item.bank_name || 'UNKNOWN BANK';
    if (!acc[bankName]) {
      acc[bankName] = [];
    }
    acc[bankName].push(item);
    return acc;
  }, {});

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

      <div className="space-y-12">
        {Object.entries(groupedByBank).map(([bankName, branches]: [string, any], bankIndex: number) => (
          <div key={bankIndex} className="bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-700/50">
            {/* 🏦 Bank Name Header */}
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
              <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
              {bankName}
              <span className="text-sm font-medium bg-slate-800 text-slate-300 px-3 py-1 rounded-full ml-auto">
                {branches.length} Branches
              </span>
            </h2>
            
            {/* 🏢 Branch Cards under the Bank */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((item: any, branchIndex: number) => {
                const micrValue = item.micr || item.micr_code;
                const branchValue = item.branch || item.branch_name;

                return (
                  <div 
                    key={branchIndex}
                    className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex flex-col shadow-sm hover:border-emerald-500/50 transition-all cursor-default"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-md font-bold text-slate-200 line-clamp-1" title={branchValue}>
                        {branchValue || 'Main Branch'}
                      </span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold px-3 py-1 rounded-lg ml-3 flex-shrink-0 tracking-widest">
                        {micrValue}
                      </span>
                    </div>
                    {item.address && (
                      <p className="text-xs text-slate-400 mt-auto line-clamp-2" title={item.address}>
                        {item.address}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}