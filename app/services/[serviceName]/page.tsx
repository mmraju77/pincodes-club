// @ts-nocheck
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// 1. Service Configuration Dictionary (The Brain)
const SERVICES_CONFIG = {
  'aadhaar-centers': {
    title: 'Aadhaar Centers Directory',
    shortTitle: 'Aadhaar Centers',
    description: 'Find authorized UIDAI Aadhaar enrollment and update centers near you.',
    icon: '🏛️',
    theme: 'text-blue-400',
    bg: 'from-blue-900 to-slate-900',
    border: 'border-blue-500/30'
  },
  'pan-offices': {
    title: 'PAN Card Offices',
    shortTitle: 'PAN Offices',
    description: 'Locate NSDL and UTIITSL PAN card centers for new applications and updates.',
    icon: '💳',
    theme: 'text-orange-400',
    bg: 'from-orange-900 to-slate-900',
    border: 'border-orange-500/30'
  },
  'passport-offices': {
    title: 'Passport Seva Kendras',
    shortTitle: 'Passport Offices',
    description: 'Search for Passport Seva Kendras (PSK) and Post Office Passport Seva Kendras (POPSK).',
    icon: '✈️',
    theme: 'text-emerald-400',
    bg: 'from-emerald-900 to-slate-900',
    border: 'border-emerald-500/30'
  },
  'government-offices': {
    title: 'Government Offices Directory',
    shortTitle: 'Government Offices',
    description: 'Find local municipal, revenue, and state government offices in your district.',
    icon: '🏢',
    theme: 'text-purple-400',
    bg: 'from-purple-900 to-slate-900',
    border: 'border-purple-500/30'
  }
};

// 2. Dynamic SEO Metadata (For Google Ranking)
export async function generateMetadata(props: any): Promise<Metadata> {
  const resolvedParams = await props.params;
  const serviceName = resolvedParams?.serviceName;
  const service = SERVICES_CONFIG[serviceName];

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} - Pincode Club`,
    description: service.description,
  };
}

// 3. Main Dynamic Component
export default async function ServiceHubPage(props: any) {
  const resolvedParams = await props.params;
  const serviceName = resolvedParams?.serviceName;
  const service = SERVICES_CONFIG[serviceName];

  // If user types a wrong URL (e.g., /services/xyz), show 404 Error page
  if (!service) {
    notFound();
  }

  // Hardcoded Popular States for UI (We will connect to Supabase DB later)
  const popularStates = [
    "ANDHRA PRADESH", "TELANGANA", "KARNATAKA", "TAMIL NADU",
    "MAHARASHTRA", "DELHI", "GUJARAT", "WEST BENGAL"
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 min-h-screen space-y-10">

      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-slate-400 items-center gap-2 bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-sm">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-white font-bold bg-slate-800 px-3 py-1 rounded-md">{service.shortTitle.toUpperCase()}</span>
      </nav>

      {/* Dynamic Hero Section */}
      <div className={`bg-gradient-to-br ${service.bg} p-10 md:p-14 rounded-3xl border ${service.border} shadow-2xl relative overflow-hidden`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl drop-shadow-lg">{service.icon}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            {service.title}
          </h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl mt-4">
          {service.description} Select your state below to find the nearest centers with complete contact details and timings.
        </p>
      </div>

      {/* States Selection Grid */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Select Your State
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularStates.map((state, index) => (
            <Link
              key={index}
              href={`/services/${serviceName}/${encodeURIComponent(state)}`}
              className="bg-[#0f172a] hover:bg-slate-800 border border-slate-800 hover:border-slate-600 p-4 rounded-xl flex items-center justify-between group transition-all shadow-md"
            >
              <span className="text-slate-300 font-medium group-hover:text-white">{state}</span>
              <svg className={`w-5 h-5 ${service.theme} transform group-hover:translate-x-1 transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}