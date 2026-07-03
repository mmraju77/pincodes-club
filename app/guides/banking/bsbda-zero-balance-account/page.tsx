import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Open a BSBDA Zero Balance Bank Account | Pincode Club',
  description: 'Complete guide on opening a Basic Savings Bank Deposit Account (BSBDA), its features, benefits, and required documents.',
};

export default function BSBDAArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-cyan-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-cyan-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/banking" className="hover:text-cyan-400 transition-colors">BANKING</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">BSBDA</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          How to Open a Basic Savings Bank Account (BSBDA)
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-cyan-500/10 text-cyan-400 text-sm font-bold px-4 py-1.5 rounded-full">Banking Essentials</span>
          <span className="text-slate-400 text-sm">Read Time: 4 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            A Basic Savings Bank Deposit Account (BSBDA) is a fundamental banking service introduced by the RBI. It's designed to bring banking to everyone by removing the stress of minimum balances and hidden charges.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Key Features of a BSBDA</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Zero Balance:</strong> Absolutely no requirement to maintain a minimum average balance.</li>
            <li><strong>Free ATM Card:</strong> Banks usually provide a free RuPay Debit Card.</li>
            <li><strong>No Charges on Non-operation:</strong> Even if you don't use the account for a long time, no penalty is levied.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Important Limits to Remember</h2>
          <p>
            While it's free, it has certain restrictions to prevent misuse:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Total credits in a year should not exceed ₹1,00,000.</li>
            <li>Maximum balance at any given time should not exceed ₹50,000.</li>
            <li>Usually limited to 4 free withdrawals per month (including ATMs).</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Required Documents</h2>
          <p>
            You can open a BSBDA with normal KYC documents: a valid Identity Proof (like Aadhaar or PAN card) and an Address Proof.
          </p>
        </div>
      </article>
    </div>
  );
}