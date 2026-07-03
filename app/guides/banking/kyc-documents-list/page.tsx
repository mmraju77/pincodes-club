import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Essential KYC Documents for Banking (2026 List) | Pincode Club',
  description: 'A comprehensive list of officially valid documents (OVDs) accepted by Indian banks for KYC compliance.',
};

export default function KYCArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-cyan-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-cyan-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/banking" className="hover:text-cyan-400 transition-colors">BANKING</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">KYC DOCUMENTS</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          Essential KYC Documents for Banking (2026 List)
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-cyan-500/10 text-cyan-400 text-sm font-bold px-4 py-1.5 rounded-full">Compliance</span>
          <span className="text-slate-400 text-sm">Read Time: 3 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            KYC (Know Your Customer) is a mandatory process implemented by the RBI to prevent identity theft, financial fraud, and money laundering. You need KYC to open an account, invest in mutual funds, or get a credit card.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Officially Valid Documents (OVDs)</h2>
          <p>
            As per RBI guidelines, you generally need two things: Proof of Identity (POI) and Proof of Address (POA). Sometimes, a single document serves both purposes.
          </p>

          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Aadhaar Card:</strong> The most widely accepted document. Serves as both POI and POA.</li>
            <li><strong>PAN Card:</strong> Mandatory for large transactions and account opening (POI only).</li>
            <li><strong>Passport:</strong> Excellent for both POI and POA.</li>
            <li><strong>Voter ID (EPIC):</strong> Accepted as both POI and POA.</li>
            <li><strong>Driving License:</strong> Valid for both, provided it has your current address.</li>
            <li><strong>NREGA Job Card:</strong> Signed by a State Government officer.</li>
          </ul>

          <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-xl mt-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">Video KYC (vKYC)</h3>
            <p className="text-sm">
              In 2026, almost all banks offer Video KYC. You don't need to visit a branch! Keep your original PAN card handy, ensure good lighting and internet, and sign on a blank paper during the video call with the bank executive.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}