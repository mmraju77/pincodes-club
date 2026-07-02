import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'India Post Saving Schemes 2026 Update | Pincode Club',
  description: 'Explore secure investment options provided by India Post including PPF, SSY, Senior Citizen Scheme, and National Savings Certificates.',
};

export default function SavingSchemesArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-blue-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-blue-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/postal" className="hover:text-blue-400 transition-colors">POSTAL</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">SAVING SCHEMES</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          India Post Saving Schemes (2026 Update)
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-blue-500/10 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full">
            Investments
          </span>
          <span className="text-slate-400 text-sm">Read Time: 5 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            India Post provides government-backed small savings schemes that offer high security and attractive interest rates. These are ideal for long-term financial planning and tax exemptions under Section 80C.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Popular Post Office Schemes</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Public Provident Fund (PPF):</strong> A 15-year long-term investment option offering excellent risk-free tax-free returns.</li>
            <li><strong>Sukanya Samriddhi Yojana (SSY):</strong> A dedicated scheme designed for the benefit of girl children, offering best-in-class interest rates.</li>
            <li><strong>National Savings Certificate (NSC):</strong> A 5-year fixed income investment scheme primarily targeted at low-to-middle income investors to help save taxes.</li>
            <li><strong>Senior Citizen Savings Scheme (SCSS):</strong> Provides regular quarterly dividend income for individuals above 60 years of age with sovereign safety.</li>
          </ul>

          <p className="mt-6">
            Since these programs are fully backed by the Government of India, your money is 100% safe, making post office investments highly reliable compared to private funds.
          </p>
        </div>
      </article>
    </div>
  );
}