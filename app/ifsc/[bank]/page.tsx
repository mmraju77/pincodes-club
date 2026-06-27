import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';

// 1. Programmatic SEO: Dynamic Metadata Generation
export async function generateMetadata({ params }: { params: { bank: string } }): Promise<Metadata> {
  const rawBankName = decodeURIComponent(params.bank).replace(/-/g, ' ');
  const bankName = rawBankName.toUpperCase();

  return {
    title: `${bankName} IFSC Codes, Branches, and Contact Details | Pincode Club`,
    description: `Find all branches, IFSC codes, MICR codes, and addresses for ${bankName} across India. Accurate and updated banking directory.`,
    keywords: `${bankName} ifsc code, ${bankName} branches, ${bankName} customer care, indian banks`,
    alternates: {
      canonical: `https://pincodes-club.com/ifsc/${params.bank}`,
    }
  };
}

// 2. Server Component for insanely fast loading and Google Indexing
export default async function BankSeoPage({ params }: { params: { bank: string } }) {
  const rawBankName = decodeURIComponent(params.bank).replace(/-/g, ' ');
  const bankName = rawBankName.toUpperCase();

  // Fetch states for this specific bank directly on the server
  const { data: statesData, error } = await supabase
    .from('ifsc_codes')
    .select('state')
    .ilike('bank', `%${bankName}%`)
    .limit(10000);

  // Remove duplicates and sort alphabetically
  const uniqueStates = Array.from(new Set(statesData?.map(r => r.state).filter(Boolean))).sort();

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/ifsc-directory" className="hover:text-blue-500 transition-colors">IFSC DIRECTORY</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{bankName}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 capitalize">
          {bankName.toLowerCase()} Branches in India
        </h1>
        <p className="text-slate-300 text-lg">
          Select a state below to find the IFSC code, MICR code, and address for 
          <span className="font-bold text-blue-400 capitalize"> {bankName.toLowerCase()} </span> branches.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uniqueStates.length > 0 ? (
          uniqueStates.map((stateName: any, index: number) => {
            // Convert spaces to dashes for the URL slug (e.g., ANDHRA PRADESH -> andhra-pradesh)
            const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <Link 
                href={`/ifsc/${params.bank}/${stateSlug}`} 
                key={index}
                className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center shadow-sm group hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📍</div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2 capitalize">
                  {stateName.toLowerCase()}
                </h3>
              </Link>
            )
          })
        ) : (
          <p className="text-slate-400">No states found for this bank or data is loading.</p>
        )}
      </div>
    </div>
  );
}