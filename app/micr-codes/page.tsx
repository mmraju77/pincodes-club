import { Metadata } from 'next';
import Link from 'next/link';
import MicrClientList from './MicrClientList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All India Bank MICR Codes Directory | Pincode Club',
  description: 'Search 9-digit MICR codes for all banks and branches across India instantly.',
  keywords: 'micr code, bank micr, micr search, indian banks micr, branch micr code',
};

export default function MicrDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-emerald-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">MICR CODES</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          All India Bank MICR Codes
        </h1>
        <p className="text-slate-300 text-lg">
          Find official 9-digit MICR codes for cheque clearing, bank branches, and financial transactions.
        </p>
      </div>

      <MicrClientList />
    </div>
  );
}