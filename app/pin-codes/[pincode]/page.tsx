import { Metadata } from 'next';
import Link from 'next/link';

type Props = {
  params: Promise<{ pincode: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// 1. DYNAMIC SEO GENERATOR
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const pin = resolvedParams.pincode;
  const office = resolvedSearch?.office as string;
  const district = resolvedSearch?.district as string;
  
  // Direct URL visit without data
  if (!office) {
    return {
      title: `${pin} PIN Code Details & Post Office Status | Pincode Club`,
      description: `Get complete postal information, district, and state details for PIN Code ${pin}.`,
    };
  }

  return {
    title: `${pin} PIN Code – ${office}, ${district} | Pincode Club`,
    description: `Find exact location, delivery status, related areas, and district details for the ${pin} PIN code (${office}). Explore comprehensive postal information instantly.`,
    keywords: `${pin} pincode, ${office} post office, ${pin} pin code details, post office near ${office}, ${district} pincode`,
  };
}

// 2. DYNAMIC PAGE STRUCTURE
export default async function PincodeDetailsPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const pin = resolvedParams.pincode;
  
  const office = resolvedSearch?.office as string;
  const district = resolvedSearch?.district as string;
  const state = resolvedSearch?.state as string;
  const delivery = resolvedSearch?.delivery as string;

  // Check if data is missing (Direct URL visit)
  const isDataMissing = !office;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      
      {/* Navigation */}
      <div>
        <nav className="flex text-sm text-slate-400 mb-6 items-center gap-2">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/pin-codes" className="hover:text-orange-500 transition-colors">PIN Codes</Link>
          <span>›</span>
          <span className="text-white font-medium">{pin}</span>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          <span className="text-orange-500">{pin}</span> PIN Code
        </h1>
        
        {!isDataMissing && (
          <p className="text-lg text-slate-300 font-medium uppercase tracking-wider">
            {office} • {district} • {state}
          </p>
        )}
      </div>

      {isDataMissing ? (
        // UI for Direct Visitors (Fallback) - Prevents "Unknown" display
        <div className="bg-slate-900/80 p-10 rounded-3xl border border-slate-700 shadow-xl text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Unlock the Full Details for {pin}</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            To view the exact post office name, delivery status, and regional details, please securely search this PIN code in our master directory.
          </p>
          <Link href={`/pin-codes?search=${pin}`} className="inline-flex items-center gap-2 text-white font-bold bg-orange-600 px-6 py-3 rounded-xl shadow-lg hover:bg-orange-500 transition-colors">
            View Details for {pin} <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </Link>
        </div>
      ) : (
        // UI for Visitors coming from Search Cards (Real Data)
        <>
          <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-full -z-10"></div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">PIN Code</span>
                <span className="text-2xl font-black text-white">{pin}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Post Office Name</span>
                <span className="text-xl font-bold text-orange-400">{office}</span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Delivery Status</span>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${delivery.toLowerCase().includes('non') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                  {delivery}
                </span>
              </div>
              
              <div className="pt-4 border-t border-slate-800">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">District</span>
                <span className="text-white font-medium">{district}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 md:col-span-3">
                <span className="text-slate-500 text-xs uppercase font-bold block mb-1">State</span>
                <span className="text-white font-medium">{state}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
              Frequently Asked Questions (FAQs)
            </h2>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-orange-400 mb-2">Which area does {pin} PIN code belong to?</h3>
              <p className="text-slate-300 leading-relaxed">The PIN code <span className="text-white font-semibold">{pin}</span> belongs to the <span className="text-white font-semibold">{office}</span> post office, located in the district of <span className="text-white font-semibold">{district}</span>, {state}.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-lg font-bold text-orange-400 mb-2">Is {office} a delivery post office?</h3>
              <p className="text-slate-300 leading-relaxed">Yes, the {office} post office handles <span className="text-white font-semibold">{delivery.toLowerCase()}</span> operations for the {pin} postal code area.</p>
            </div>
          </div>
        </>
      )}

      {/* Internal Linking (Always visible for SEO) */}
      <div className="pt-8 border-t border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Explore Related PIN Codes</h2>
        <div className="flex flex-wrap gap-3">
          <Link href={`/pin-codes/${parseInt(pin) + 1}`} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors border border-slate-700 text-sm font-semibold shadow-sm">
            {parseInt(pin) + 1}
          </Link>
          <Link href={`/pin-codes/${parseInt(pin) - 1}`} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors border border-slate-700 text-sm font-semibold shadow-sm">
            {parseInt(pin) - 1}
          </Link>
        </div>
      </div>

    </div>
  );
}