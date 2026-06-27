import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../../../lib/supabase';

type Props = {
  params: Promise<{ bank: string; state: string; district: string }>;
};

// 1. DYNAMIC SEO METADATA FOR GOOGLE INDEXING

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const bankName = decodeURIComponent(resolvedParams.bank).replace(/-/g, ' ').toUpperCase();
  const stateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ').toUpperCase();
  const districtName = decodeURIComponent(resolvedParams.district).replace(/-/g, ' ').toUpperCase();

  return {
    title: `${bankName} Branches in ${districtName}, ${stateName} - IFSC & MICR Codes | Pincode Club`,
    description: `Find all ${bankName} branches in ${districtName}, ${stateName}. Get accurate IFSC codes, MICR codes, branch addresses, and contact numbers instantly.`,
    keywords: `${bankName} ${districtName} branches, ${bankName} ifsc code ${districtName}, ${stateName} banking directory`,
    alternates: {
      canonical: `https://pincodes-club.com/ifsc/${resolvedParams.bank}/${resolvedParams.state}/${resolvedParams.district}`,
    }
  };
}

// 2. SERVER COMPONENT FOR ULTIMATE PERFORMANCE
export default async function DistrictSeoPage({ params }: Props) {
  const resolvedParams = await params;
  const bankName = decodeURIComponent(resolvedParams.bank).replace(/-/g, ' ').toUpperCase();
  const stateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ').toUpperCase();
  const districtName = decodeURIComponent(resolvedParams.district).replace(/-/g, ' ').toUpperCase();

  // Fetch all branches for this specific district
  const { data: branchesData, error } = await supabase
    .from('ifsc_codes')
    .select('*')
    .ilike('bank', `%${bankName}%`)
    .ilike('state', `%${stateName}%`)
    .ilike('district', `%${districtName}%`)
    .order('branch', { ascending: true })
    .limit(1000);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      
      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/ifsc-directory" className="hover:text-blue-500 transition-colors">IFSC DIRECTORY</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/ifsc/${resolvedParams.bank}`} className="hover:text-blue-500 transition-colors uppercase">{bankName}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/ifsc/${resolvedParams.bank}/${resolvedParams.state}`} className="hover:text-blue-500 transition-colors uppercase">{stateName}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{districtName}</span>
      </nav>

      {/* HEADER SECTION */}
      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 capitalize">
          {bankName.toLowerCase()} Branches in {districtName.toLowerCase()}
        </h1>
        <p className="text-slate-300 text-lg">
          Complete list of <span className="font-bold text-blue-400 capitalize">{bankName.toLowerCase()}</span> branches located in <span className="font-bold text-white capitalize">{districtName.toLowerCase()}</span>.
        </p>
      </div>

      {/* BRANCHES LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {branchesData && branchesData.length > 0 ? (
          branchesData.map((branch: any, index: number) => {
            const ifscCode = branch.ifsc || 'N/A';
            const branchName = branch.branch || 'N/A';
            const city = branch.centre || branch.city || 'N/A';
            const address = branch.address || 'N/A';
            const contact = branch.contact || branch.phone || 'Not Available';
            const micrCode = branch.micr || 'Not Available';

            return (
              <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col relative shadow-xl group hover:scale-[1.01]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] -z-10 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-blue-400 mb-1 capitalize">{branchName.toLowerCase()}</h3>
                    <p className="text-sm font-semibold text-slate-300 capitalize flex items-center gap-1">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> 
                      {bankName.toLowerCase()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg shadow-blue-600/20 tracking-widest mb-2">{ifscCode}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">City / Centre</span><span className="text-white font-medium truncate block capitalize">{city.toLowerCase()}</span></div>
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Contact Number</span><span className="text-white font-medium truncate block">{contact}</span></div>
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">MICR Code</span><span className="text-white font-medium truncate block">{micrCode}</span></div>
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">District</span><span className="text-white font-medium truncate block capitalize">{districtName.toLowerCase()}</span></div>
                  <div className="col-span-2"><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Address</span><span className="text-white font-medium block text-xs leading-relaxed capitalize">{address.toLowerCase()}</span></div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-400 text-lg">No branches found matching this district.</p>
          </div>
        )}
      </div>
    </div>
  );
}