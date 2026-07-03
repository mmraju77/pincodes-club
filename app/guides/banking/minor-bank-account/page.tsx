import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Step-by-Step Guide to Opening a Minor Bank Account | Pincode Club',
  description: 'Learn how to open a bank account for children under 18. Understand the documents required and benefits of a minor account.',
};

export default function MinorAccountArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-cyan-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-cyan-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/banking" className="hover:text-cyan-400 transition-colors">BANKING</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">MINOR ACCOUNT</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          Step-by-Step Guide to Opening a Minor Bank Account
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-cyan-500/10 text-cyan-400 text-sm font-bold px-4 py-1.5 rounded-full">Personal Finance</span>
          <span className="text-slate-400 text-sm">Read Time: 5 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            Opening a bank account for a minor (someone under 18 years of age) is a great way to teach them financial responsibility early on. Most major banks in India offer specialized accounts for kids.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Types of Minor Accounts</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Below 10 Years:</strong> Operated jointly by the natural guardian (parent) on behalf of the minor.</li>
            <li><strong>Above 10 Years:</strong> Can be operated independently by the minor. Banks often issue a special debit card with spending limits.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8">Documents Required</h2>
          <p>Since the minor doesn't have an independent financial footprint, the guardian's documents are crucial:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Birth Certificate of the minor.</li>
            <li>Aadhaar Card of the minor (if available).</li>
            <li>PAN Card and Aadhaar Card of the parent/guardian.</li>
            <li>Passport-size photographs of both minor and guardian.</li>
          </ul>

          <p className="mt-6">
            When the minor turns 18, the account must be converted to a regular savings account by submitting fresh KYC documents.
          </p>
        </div>
      </article>
    </div>
  );
}