import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ ifsc: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 1. DYNAMIC SEO GENERATOR FOR BANK BRANCHES
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const ifsc = resolvedParams.ifsc;
  const bank = resolvedSearch?.bank as string;
  const branch = resolvedSearch?.branch as string;
  const city = resolvedSearch?.city as string;
  
  if (!bank) {
    return {
      title: `${ifsc} IFSC Code Details & Bank Branch Address | Pincode Club`,
      description: `Get complete bank branch information, MICR code, and address details for IFSC Code ${ifsc}.`,
    };
  }

  return {
    title: `${ifsc} IFSC Code – ${bank}, ${branch} Branch, ${city} | Pincode Club`,
    description: `Find exact branch address, MICR code, contact details, and location for ${bank} - ${branch} branch in ${city} (IFSC: ${ifsc}).`,
    keywords: `${ifsc} ifsc code, ${bank} ${branch} ifsc, ${ifsc} micr code, ${bank} branch near me, ${city} bank branches`,
  };
}

// 2. DYNAMIC PAGE STRUCTURE
export default async function IfscDetailsPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const ifsc = resolvedParams.ifsc;
  
  const bank = resolvedSearch?.bank as string;
  const branch = resolvedSearch?.branch as string;
  const city = resolvedSearch?.city as string;
  const district = resolvedSearch?.district as string;
  const state = resolvedSearch?.state as string;
  const micr = resolvedSearch?.micr as string;
  const address = resolvedSearch?.address as string;
  const contact = resolvedSearch?.contact as string;

  const isDataMissing = !bank;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      
      {/* Navigation */}
      <div>
        <nav className="flex text-sm text-slate-400 mb-6 items-center gap-2">
          <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/ifsc-directory" className="hover:text-blue-500 transition-colors">IFSC Directory</Link>
          <span>›</span>
          <span className="text-white font-medium">{ifsc}</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          <span className="text-blue-500">{ifsc}</span> IFSC Code
        </h1>
        
        {!isDataMissing && (
          <p className="text-lg text-slate-300 font-medium uppercase tracking-wider">
            {bank} • {branch}
          </p>
        )}
      </div>

      {isDataMissing ? (
        // UI for Direct Visitors (Fallback) - Prevents "Unknown" display
        <div className="bg-slate-900/80 p-10 rounded-3xl border border-slate-700 shadow-xl text-center">
          <div className="text-5xl mb-4">🏦</div>
          <h2 className="text-2xl font-bold text-white mb-2">Unlock Full Branch Details for {ifsc}</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            To view the exact bank name, branch address, MICR code, and contact details, please securely search this IFSC in our master directory.
          </p>
          <Link href={`/ifsc-directory?search=${ifsc}`} className="inline-flex items-center gap-2 text-white font-bold bg-blue-600 px-6 py-3 rounded-xl shadow-lg hover:bg-blue-500 transition-colors">
            View Details for {ifsc} <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </Link>
        </div>
      ) : (
        // UI for Visitors coming from Search Cards (Real Data)
        <>
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10"></div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Bank Name</span>
                <span className="text-xl font-bold text-blue-400">{bank}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">IFSC Code</span>
                <span className="text-2xl font-black text-white">{ifsc}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">MICR Code</span>
                <span className="text-xl font-medium text-white">{micr}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-800 md:col-span-2">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Branch Name</span>
                <span className="text-white font-medium">{branch}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 md:col-span-2">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Contact Details</span>
                <span className="text-green-400 font-medium">📞 {contact}</span>
              </div>

              <div className="pt-4 border-t border-slate-800 md:col-span-4">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Full Branch Address</span>
                <p className="text-slate-300 leading-relaxed">{address}</p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">City</span>
                <span className="text-white font-medium">{city}</span>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">District</span>
                <span className="text-white font-medium">{district}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 md:col-span-2">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">State</span>
                <span className="text-white font-medium">{state}</span>
              </div>
            </div>
          </div>

          {/* Programmatic FAQ Section */}
          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-blue-400 mb-2">Where is the {bank} {branch} branch located?</h3>
              <p className="text-slate-300 leading-relaxed">The <span className="text-white font-semibold">{branch}</span> branch of <span className="text-white font-semibold">{bank}</span> is located in <span className="text-white font-semibold">{city}</span>, {district}, {state}. The exact address is: {address}.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-blue-400 mb-2">What are the IFSC and MICR codes for this branch?</h3>
              <p className="text-slate-300 leading-relaxed">The IFSC Code is <span className="text-white font-semibold">{ifsc}</span> and the MICR Code is <span className="text-white font-semibold">{micr}</span>. You can use these codes for NEFT, RTGS, and IMPS transactions.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}