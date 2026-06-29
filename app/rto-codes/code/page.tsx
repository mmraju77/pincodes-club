import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ regno: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedRegno = decodeURIComponent(resolvedParams.regno).toUpperCase();
  return {
    title: `${decodedRegno} RTO Code Details | Pincode Club`,
    description: `Official details for RTO Code ${decodedRegno}. Find vehicle registration state, region, and RTO office details instantly.`,
  };
}

export default async function RtoDetailsPage({ params }: Props) {
  const resolvedParams = await params;
  const decodedRegno = decodeURIComponent(resolvedParams.regno).trim();

  // Smart Search: Uses wildcards (%) to ignore any hidden spaces in the database
  const { data, error } = await supabase
    .from('rto_codes')
    .select('*')
    .ilike('regno', `%${decodedRegno}%`)
    .limit(1);

  const rtoData = data?.[0];

  if (error || !rtoData) {
    // Custom RTO Error Page (Overrides the Global Pincode Area Not Found page)
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center min-h-screen">
        <h1 className="text-4xl text-red-400 font-extrabold mb-4">RTO Code Not Found</h1>
        <p className="text-slate-400 text-lg">We couldn't locate data for RTO Code: <span className="font-bold text-white">{decodedRegno}</span></p>
        <p className="text-slate-500 mt-2">This code might be invalid or not yet updated in our database.</p>
        <Link href="/rto-codes" className="mt-8 inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg">
          Return to Search
        </Link>
      </div>
    );
  }

  const stateSlug = String(rtoData.state || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/rto-codes" className="hover:text-blue-500 transition-colors">RTO CODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{rtoData.regno}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-start gap-6 relative z-10">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 px-6 py-2 rounded-lg font-black text-4xl shadow-lg">
            {rtoData.regno}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {rtoData.place}
          </h1>

          <div className="w-full h-px bg-slate-700/50 my-4"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Registration State</p>
              <Link href={`/rto-codes/${stateSlug}`} className="text-xl font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2">
                {rtoData.state}
                <span className="text-xs bg-amber-500/20 px-2 py-1 rounded ml-2 text-amber-200">View All ➔</span>
              </Link>
            </div>
            
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">RTO Office Region</p>
              <p className="text-xl font-medium text-slate-200">{rtoData.place}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}