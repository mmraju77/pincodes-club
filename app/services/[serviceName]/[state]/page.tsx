// @ts-nocheck
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 1. Service Config (To match colors dynamically)
const SERVICES_CONFIG = {
  'aadhaar-centers': { shortTitle: 'Aadhaar Centers', icon: '🏛️', theme: 'text-blue-400', bg: 'from-blue-900 to-slate-900', border: 'border-blue-500', badge: 'bg-blue-500/20 text-blue-300' },
  'pan-offices': { shortTitle: 'PAN Offices', icon: '💳', theme: 'text-orange-400', bg: 'from-orange-900 to-slate-900', border: 'border-orange-500', badge: 'bg-orange-500/20 text-orange-300' },
  'passport-offices': { shortTitle: 'Passport Offices', icon: '✈️', theme: 'text-emerald-400', bg: 'from-emerald-900 to-slate-900', border: 'border-emerald-500', badge: 'bg-emerald-500/20 text-emerald-300' },
  'government-offices': { shortTitle: 'Govt Offices', icon: '🏢', theme: 'text-purple-400', bg: 'from-purple-900 to-slate-900', border: 'border-purple-500', badge: 'bg-purple-500/20 text-purple-300' }
};

export default async function StateServicePage(props: any) {
  const resolvedParams = await props.params;
  const serviceName = resolvedParams?.serviceName;
  const stateName = decodeURIComponent(resolvedParams?.state || '');
  const service = SERVICES_CONFIG[serviceName];

  if (!service) notFound();

  // 2. Fetch Live Data from Supabase Database
  const { data: centers, error } = await supabase
    .from('government_services')
    .select('*')
    .eq('service_type', serviceName)
    .eq('state', stateName);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-slate-400 items-center gap-2 bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-sm flex-wrap">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href={`/services/${serviceName}`} className="hover:text-white transition-colors">
          {service.shortTitle.toUpperCase()}
        </Link>
        <span>/</span>
        <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-md">{stateName}</span>
      </nav>

      {/* Header Section */}
      <div className={`bg-gradient-to-br ${service.bg} p-8 md:p-10 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden flex items-center gap-5`}>
        <span className="text-5xl drop-shadow-lg">{service.icon}</span>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {stateName}
          </h1>
          <p className="text-slate-300 text-lg mt-1">
            Showing {centers?.length || 0} registered {service.shortTitle}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      {centers && centers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <div key={center.id} className="bg-[#0f172a] border border-slate-800 hover:border-slate-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${service.bg}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${service.badge}`}>
                  {center.district}
                </span>
                <span className="text-slate-500 text-xs font-semibold bg-slate-800 px-2 py-1 rounded">
                  PIN: <span className="text-white">{center.pincode}</span>
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-slate-200 transition-colors">
                {center.center_name}
              </h2>

              <div className="space-y-2 text-sm text-slate-400">
                <p className="flex items-start gap-2">
                  <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${service.theme}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{center.address}</span>
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <svg className={`w-5 h-5 ${service.theme}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Helpdesk: <span className="text-white">{center.contact_number}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-slate-800">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-2xl font-bold text-white mb-2">No Centers Found</h3>
          <p className="text-slate-400">We are still updating the database for {stateName}.</p>
        </div>
      )}

    </div>
  );
}