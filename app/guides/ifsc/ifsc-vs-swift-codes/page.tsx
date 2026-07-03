import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IFSC Code vs SWIFT Code: Key Differences | Pincode Club',
  description: 'Discover the differences between Indian Financial System Code (IFSC) and SWIFT code for domestic vs international wire transfers.',
};

export default function SwiftIfscArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-sky-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-sky-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/ifsc" className="hover:text-sky-400 transition-colors">IFSC</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">IFSC VS SWIFT</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          IFSC Code vs SWIFT Code: What's the Difference?
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-sky-500/10 text-sky-400 text-sm font-bold px-4 py-1.5 rounded-full">Global Banking</span>
          <span className="text-slate-400 text-sm">Read Time: 3 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            When making digital payments, you are often asked for a routing code. The two most common codes you will encounter are IFSC and SWIFT. Knowing the difference is crucial for successful transfers.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">IFSC (Indian Financial System Code)</h2>
          <p>
            The IFSC is an 11-character alphanumeric code used strictly for <strong>Domestic Transfers</strong> (within India). 
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage:</strong> Used for NEFT, RTGS, and IMPS.</li>
            <li><strong>Format:</strong> 4 letters (Bank Code) + 1 zero + 6 characters (Branch Code).</li>
            <li><strong>Scope:</strong> Cannot be used to receive money from outside India.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">SWIFT (Society for Worldwide Interbank Financial Telecommunication)</h2>
          <p>
            A SWIFT code (or BIC) is an 8 or 11-character code used for <strong>International Wire Transfers</strong>. 
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage:</strong> Receiving remittances, freelance payments, or YouTube earnings from abroad to your Indian account.</li>
            <li><strong>Format:</strong> Identifies the Bank, Country, Location, and (optionally) the specific Branch.</li>
            <li><strong>Availability:</strong> Not every small branch has a SWIFT code. Often, you use the SWIFT code of the bank's main nodal branch in your city.</li>
          </ul>
        </div>
      </article>
    </div>
  );
}