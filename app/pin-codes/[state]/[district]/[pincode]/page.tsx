import Link from 'next/link';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// PHASE 11: AUTOMATION - Dynamic SEO Metadata Generation
export async function generateMetadata(props: any): Promise<Metadata> {
  const resolvedParams = await props.params;
  const stateName = resolvedParams?.state ? decodeURIComponent(resolvedParams.state).toUpperCase() : '';
  const districtName = resolvedParams?.district ? decodeURIComponent(resolvedParams.district).toUpperCase() : '';
  const currentPincode = resolvedParams?.pincode || '';

  return {
    title: `${currentPincode} PIN Code - ${districtName}, ${stateName} Post Office Details`,
    description: `Find complete postal and banking details for PIN Code ${currentPincode} located in ${districtName}, ${stateName}. Automatically updated directory.`,
    keywords: `${currentPincode}, ${currentPincode} pin code, ${districtName} district pincodes, ${stateName} postal codes, post office near me, ifsc codes`,
    openGraph: {
      title: `${currentPincode} PIN Code Information`,
      description: `Complete details for ${currentPincode} in ${districtName}, ${stateName}.`,
      siteName: 'Pincode Club',
    },
  };
}

// MAIN PAGE COMPONENT
export default async function PincodeDetailPage(props: any) {
  const resolvedParams = await props.params;
  
  const stateName = resolvedParams?.state ? decodeURIComponent(resolvedParams.state).toUpperCase() : '';
  const districtName = resolvedParams?.district ? decodeURIComponent(resolvedParams.district).toUpperCase() : '';
  const currentPincode = resolvedParams?.pincode || '';

  // 1. Fetch current Post Office details to get division/region info
  const { data: currentPOData } = await supabase
    .from('pincodes')
    .select('*')
    .eq('pincode', currentPincode)
    .limit(1)
    .single();

  const divisionName = currentPOData?.divisionname || '';
  const currentOfficeName = currentPOData?.officename || 'This Post Office';

  // 2. Fetch Nearby Areas (Same District, Different Pincode)
  const { data: rawNearbyAreas } = await supabase
    .from('pincodes') 
    .select('*')
    .ilike('circlename', `%${stateName}%`)
    .neq('pincode', currentPincode)
    .limit(100);

  const nearbyAreas = rawNearbyAreas?.filter((d: any) => {
    const dName = d.districtname || d.Districtname || d.district || d.divisionname || '';
    return dName.toUpperCase() === districtName;
  }).slice(0, 8);

  // 3. Fetch Nearby Banks (Same District)
  const { data: nearbyBanks } = await supabase
    .from('ifsc_codes')
    .select('bank_name, ifsc, branch')
    .ilike('district', `%${districtName}%`)
    .limit(5);

  // 4. Fetch Related Post Offices in the Same Division (Internal Linking Strategy)
  let relatedPostOffices: any[] = [];
  if (divisionName) {
    const { data: rawRelatedPOs } = await supabase
      .from('pincodes')
      .select('*')
      .eq('divisionname', divisionName)
      .neq('pincode', currentPincode)
      .limit(10);
    relatedPostOffices = rawRelatedPOs || [];
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-10">
      
      {/* SEO Breadcrumb Navigation */}
      <nav className="flex text-sm text-slate-400 items-center gap-2 flex-wrap bg-[#0f172a] p-4 rounded-xl border border-slate-800">
        <Link href="/" className="hover:text-orange-400 transition-colors font-medium">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/pin-codes" className="hover:text-orange-400 transition-colors font-medium">PIN CODES</Link>
        <span className="text-slate-600">/</span>
        <Link href={`/pin-codes/${resolvedParams?.state}`} className="hover:text-orange-400 transition-colors font-medium">{stateName}</Link>
        <span className="text-slate-600">/</span>
        <Link href={`/pin-codes/${resolvedParams?.state}/${resolvedParams?.district}`} className="hover:text-orange-400 transition-colors font-medium">{districtName}</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold bg-orange-500/20 px-3 py-1 rounded-md text-orange-400">{currentPincode}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
        
        <span className="bg-orange-500/20 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-6 inline-block border border-orange-500/30">
          {currentPOData?.officetype || 'POST OFFICE'} DETAILS
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          {currentOfficeName} PIN Code: <span className="text-orange-400">{currentPincode}</span>
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl">
          Complete postal details for {currentOfficeName} ({currentPincode}) located in the {divisionName} division of {districtName} district, {stateName}.
        </p>
      </div>

      {/* Internal Linking Strategy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        
        {/* 1. Nearby Areas (Different Pincodes in same district) */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Nearby Areas in {districtName}</h2>
          </div>
          <div className="flex flex-wrap gap-2 flex-grow">
            {nearbyAreas && nearbyAreas.length > 0 ? (
              nearbyAreas.map((area: any, index: number) => (
                <Link key={index} href={`/pin-codes/${resolvedParams?.state}/${resolvedParams?.district}/${area.pincode}`} className="text-xs font-medium bg-slate-800/80 text-slate-300 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-slate-700">
                  {area.officename} - {area.pincode}
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">More areas loading soon...</p>
            )}
          </div>
        </div>

        {/* 2. Related Post Offices (Same Division) */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Post Offices in {divisionName}</h2>
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            {relatedPostOffices && relatedPostOffices.length > 0 ? (
              relatedPostOffices.map((po: any, index: number) => {
                const dName = po.districtname || po.Districtname || po.district || districtName;
                return (
                  <Link key={index} href={`/pin-codes/${resolvedParams?.state}/${encodeURIComponent(dName)}/${po.pincode}`} className="text-slate-400 hover:text-orange-400 flex justify-between items-center bg-slate-800/40 hover:bg-slate-800 p-2.5 rounded-xl transition-all text-sm border border-transparent hover:border-slate-700">
                    <span className="truncate pr-4 font-medium">{po.officename}</span>
                    <span className="text-orange-500/70 text-xs font-mono bg-orange-500/10 px-2 py-1 rounded">{po.pincode}</span>
                  </Link>
                )
              })
            ) : (
              <p className="text-sm text-slate-500">Searching for related post offices...</p>
            )}
          </div>
        </div>

        {/* 3. Nearby Banks */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all flex flex-col shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white">Banks Near {districtName}</h2>
          </div>
          <div className="flex flex-col gap-3 flex-grow">
            {nearbyBanks && nearbyBanks.length > 0 ? (
              nearbyBanks.map((bank: any, index: number) => (
                <Link key={index} href="/ifsc-directory" className="text-slate-400 hover:text-emerald-400 flex justify-between items-center bg-slate-800/40 hover:bg-slate-800 p-3 rounded-xl transition-all text-sm border border-transparent hover:border-slate-700">
                  <span className="truncate pr-4 font-medium">{bank.bank_name} - {bank.branch}</span>
                  <span className="text-emerald-500 text-xs font-mono">{bank.ifsc}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">Searching for banks nearby...</p>
            )}
          </div>
          <Link href="/ifsc-directory" className="mt-6 text-sm text-center text-emerald-400 hover:text-emerald-300 font-bold w-full bg-slate-800/50 py-3 rounded-xl transition-all border border-emerald-500/20 hover:border-emerald-500/40">
            Search All Bank IFSC Codes &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}