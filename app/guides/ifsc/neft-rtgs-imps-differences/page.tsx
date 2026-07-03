import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Differences Between NEFT, RTGS, and IMPS | Pincode Club',
  description: 'Learn the exact limits, processing times, and use cases for NEFT, RTGS, and IMPS digital payment systems in India.',
};

export default function NeftRtgsImpsArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-sky-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-sky-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/ifsc" className="hover:text-sky-400 transition-colors">IFSC</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">DIGITAL PAYMENTS</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          Understanding Digital Payments: NEFT, RTGS & IMPS
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-sky-500/10 text-sky-400 text-sm font-bold px-4 py-1.5 rounded-full">Transfers</span>
          <span className="text-slate-400 text-sm">Read Time: 5 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            When transferring money to another bank account in India, an IFSC code is mandatory. However, you also have to choose the method of transfer: NEFT, RTGS, or IMPS. Here is how they differ.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">1. NEFT (National Electronic Funds Transfer)</h2>
          <p>
            NEFT operates in half-hourly batches. When you initiate a transfer, it joins a queue and is processed in the next available batch.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Minimum Transfer:</strong> ₹1</li>
            <li><strong>Maximum Limit:</strong> No upper limit (though banks may have their own online limits).</li>
            <li><strong>Speed:</strong> Usually takes 30 minutes to 2 hours. Available 24x7.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">2. RTGS (Real Time Gross Settlement)</h2>
          <p>
            RTGS is meant for high-value transactions. The settlement happens in "real-time" and on a "gross" basis (individually, not in batches).
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Minimum Transfer:</strong> ₹2,00,000</li>
            <li><strong>Maximum Limit:</strong> No upper limit.</li>
            <li><strong>Speed:</strong> Instantaneous. Available 24x7.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">3. IMPS (Immediate Payment Service)</h2>
          <p>
            Managed by NPCI, IMPS is designed for instant, lower-value transfers using mobile phones or net banking.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Minimum Transfer:</strong> ₹1</li>
            <li><strong>Maximum Limit:</strong> ₹5,00,000 (recently updated by RBI).</li>
            <li><strong>Speed:</strong> Instant. Available 24x7, 365 days a year.</li>
          </ul>
        </div>
      </article>
    </div>
  );
}