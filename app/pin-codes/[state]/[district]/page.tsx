import { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../../../../lib/supabase';

type Props = {
  params: Promise<{ state: string; district: string }>;
};

// 1. DYNAMIC SEO METADATA

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const stateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ').toUpperCase();
  const districtName = decodeURIComponent(resolvedParams.district).replace(/-/g, ' ').toUpperCase();

  return {
    title: `Pincodes in ${districtName}, ${stateName} - Post Offices Directory | Pincode Club`,
    description: `Find all pincodes and post office details in ${districtName}, ${stateName}. Includes office type, delivery status, and division information.`,
    keywords: `${districtName} pincodes, post offices in ${districtName} ${stateName}, postal codes`,
    alternates: {
      canonical: `https://pincodes-club.com/pin-codes/${resolvedParams.state}/${resolvedParams.district}`,
    }
  };
}

// 2. SERVER COMPONENT
export default async function PincodeDistrictPage({ params }: Props) {
  const resolvedParams = await params;
  const stateName = decodeURIComponent(resolvedParams.state).replace(/-/g, ' ').toUpperCase();
  const districtName = decodeURIComponent(resolvedParams.district).replace(/-/g, ' ').toUpperCase();

  // Fetch post offices matching statename and district columns
  const { data: officesData, error } = await supabase
    .from('pincodes')
    .select('*')
    .ilike('statename', `%${stateName}%`)
    .ilike('district', `%${districtName}%`)
    .order('officename', { ascending: true })
    .limit(1500);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/pin-codes" className="hover:text-blue-500 transition-colors">PINCODES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href={`/pin-codes/${resolvedParams.state}`} className="hover:text-blue-500 transition-colors uppercase">{stateName}</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">{districtName}</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4 capitalize">
          Post Offices in {districtName.toLowerCase()}
        </h1>
        <p className="text-slate-300 text-lg">
          Complete list of post offices and pincodes in <span className="font-bold text-emerald-400 capitalize">{districtName.toLowerCase()}</span>, <span className="text-white capitalize">{stateName.toLowerCase()}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {officesData && officesData.length > 0 ? (
          officesData.map((office: any, index: number) => {
            const pincode = office.pincode || 'N/A';
            const officeName = office.officename || 'N/A';
            const officeType = office.officetype || 'N/A';
            const delivery = office.delivery || 'N/A';
            const division = office.divisionname || 'N/A';
            const region = office.regionname || 'N/A';

            return (
              <div key={index} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col relative shadow-xl group hover:scale-[1.01]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] -z-10 group-hover:bg-emerald-500/10 transition-colors"></div>
                <div className="flex justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                  <div className="flex-1 pr-4">
                    <h3 className="text-xl font-bold text-emerald-400 mb-1 capitalize">{officeName.toLowerCase()}</h3>
                    <p className="text-sm font-semibold text-slate-300 capitalize flex items-center gap-1">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> 
                      {officeType} - {delivery}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg shadow-emerald-600/20 tracking-widest mb-2">{pincode}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-3 pt-2 text-sm flex-grow">
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Division</span><span className="text-white font-medium truncate block capitalize">{division.toLowerCase()}</span></div>
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Region</span><span className="text-white font-medium truncate block capitalize">{region.toLowerCase()}</span></div>
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">District</span><span className="text-white font-medium truncate block capitalize">{districtName.toLowerCase()}</span></div>
                  <div><span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5 tracking-wider">State</span><span className="text-white font-medium truncate block capitalize">{stateName.toLowerCase()}</span></div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-slate-400 text-lg">No post offices found for this location.</p>
          </div>
        )}
      </div>
    </div>
  );
}