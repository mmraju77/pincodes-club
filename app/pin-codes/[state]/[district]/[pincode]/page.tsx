// @ts-nocheck
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function PincodeDetailsPage() {
  const params = useParams();
  const stateName = decodeURIComponent(params.state as string).toUpperCase();
  const districtName = decodeURIComponent(params.district as string).toUpperCase();
  const pincode = params.pincode as string;
  
  const [offices, setOffices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPincodeDetails() {
      const { data } = await supabase
        .from('pincodes')
        .select('*')
        .eq('pincode', pincode);
      if (data) setOffices(data);
      setIsLoading(false);
    }
    fetchPincodeDetails();
  }, [pincode]);

  const mainOffice = offices.length > 0 ? offices.find(o => o.officetype === 'S.O' || o.officetype === 'H.O') || offices[0] : null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link href="/pin-codes" className="hover:text-purple-400">ALL STATES</Link>
        <span>/</span>
        <Link href={`/pin-codes/${encodeURIComponent(stateName)}`} className="hover:text-purple-400">{stateName}</Link>
        <span>/</span>
        <Link href={`/pin-codes/${encodeURIComponent(stateName)}/${encodeURIComponent(districtName)}`} className="hover:text-purple-400">{districtName}</Link>
        <span>/</span>
        <span className="text-white">{pincode}</span>
      </div>

      {isLoading ? (
        <div className="text-center text-purple-400 animate-pulse font-bold text-xl py-12">Loading Area Details...</div>
      ) : mainOffice ? (
        <>
          {/* Main Hero Header */}
          <div className="bg-gradient-to-br from-[#0f172a] to-purple-900/20 border border-slate-700 rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 font-bold text-xs rounded-md mb-3 border border-purple-500/30 uppercase">
                  {mainOffice.officetype === 'S.O' ? 'Sub Office' : mainOffice.officetype === 'H.O' ? 'Head Office' : 'Branch Office'}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                  {toTitleCase(mainOffice.officename)}
                </h1>
                <p className="text-slate-400 text-lg">
                  {toTitleCase(mainOffice.district)} District, {toTitleCase(mainOffice.statename)}
                </p>
              </div>
              <div className="bg-slate-900 border-2 border-purple-500/50 p-6 rounded-2xl text-center shadow-lg min-w-[200px]">
                <span className="block text-slate-400 font-bold uppercase text-sm mb-1">PINCODE</span>
                <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 font-black tracking-widest">{pincode}</span>
              </div>
            </div>
          </div>

          {/* Detailed SEO Content Paragraph */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 md:p-8 mb-10 leading-relaxed text-slate-300 text-lg shadow-inner">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              About {toTitleCase(mainOffice.officename)} Post Office
            </h2>
            <p className="mb-4">
              The pincode <strong>{pincode}</strong> belongs to <strong>{toTitleCase(mainOffice.officename)}</strong>, which functions as a {mainOffice.officetype} under the {toTitleCase(mainOffice.divisionname || mainOffice.district)} postal division. This post office is situated in the state of <strong>{toTitleCase(mainOffice.statename)}</strong>, offering essential mailing and financial services to the local residents of the {toTitleCase(mainOffice.regionname || mainOffice.district)} region.
            </p>
            <p>
              Currently, the delivery status for this area is marked as <strong className="text-emerald-400">{mainOffice.delivery || 'Available'}</strong>. If you are sending a parcel, courier, or official document to this locality, ensure you clearly mention the postal code <strong>{pincode}</strong> for fast and accurate delivery.
            </p>
          </div>

          {/* Twin Features: Other POs & Nearest Banks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: All Offices under this Pincode */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Locations sharing Pincode {pincode}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offices.map((office, idx) => (
                  <div key={idx} className="bg-[#0f172a] border border-slate-700 p-5 rounded-xl flex items-start gap-3 hover:border-purple-500/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-purple-400 mt-1">📍</div>
                    <div>
                      <h4 className="text-white font-bold text-lg">{toTitleCase(office.officename)}</h4>
                      <p className="text-slate-400 text-sm">{office.officetype} • {toTitleCase(office.taluk || office.district)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Nearest Banks / Utilities */}
            <div className="space-y-6">
              <div className="bg-gradient-to-b from-blue-900/40 to-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl text-center">
                <div className="text-5xl mb-4">🏦</div>
                <h3 className="text-xl font-bold text-white mb-2">Nearest Banks & IFSC</h3>
                <p className="text-slate-400 text-sm mb-6">Find nationalized and private banks located near {toTitleCase(mainOffice.officename)}.</p>
                <Link href={`/ifsc-directory`} className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-md">
                  Search Bank Branches
                </Link>
              </div>

              <div className="bg-gradient-to-b from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl text-center">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-xl font-bold text-white mb-2">Aadhaar Centers</h3>
                <p className="text-slate-400 text-sm mb-6">Locate official UIDAI Aadhaar update centers in {toTitleCase(mainOffice.district)} district.</p>
                <Link href={`/services/aadhaar-centers/${encodeURIComponent(stateName)}/${encodeURIComponent(districtName)}`} className="inline-block w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-md">
                  Find Aadhaar Centers
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-slate-400 text-lg">Details not found.</div>
      )}
    </div>
  );
}