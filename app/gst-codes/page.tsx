import { Metadata } from 'next';
import Link from 'next/link';
import GstClientList from './GstClientList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All India GST State Codes Directory | Pincode Club',
  description: 'Find official 2-digit GST state codes for all Indian states and Union Territories.',
};

export default function GstDirectoryPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 space-y-8 flex flex-col min-h-screen">
      <nav className="flex text-sm text-slate-400 mb-8 items-center gap-2">
        <Link href="/" className="hover:text-purple-500 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-medium uppercase">GST CODES</span>
      </nav>

      <div className="bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
          All India GST State Codes
        </h1>
        <p className="text-slate-300 text-lg">
          Complete directory of the official 2-digit GST state codes used in GSTIN numbers across India.
        </p>
      </div>

      <GstClientList />
    </div>
  );
}