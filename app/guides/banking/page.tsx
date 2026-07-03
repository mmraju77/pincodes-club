import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Banking Guides & Account Opening Tutorials | Pincode Club',
  description: 'Expert banking guides on how to open different types of bank accounts, required KYC documents, and net banking tutorials.',
};

export default function BankingGuidesPage() {
  const articles = [
    {
      title: "How to Open a Basic Savings Bank Account (BSBDA)",
      content: "A Basic Savings Bank Deposit Account (BSBDA) is a Zero Balance account introduced by the RBI to promote financial inclusion. It allows you to deposit and withdraw money without the stress of maintaining a minimum balance. Learn about the exact KYC documents needed and the monthly transaction limits.",
      readTime: "4 min read",
      link: "/guides/banking/bsbda-zero-balance-account"
    },
    {
      title: "Step-by-Step Guide to Opening a Minor Bank Account",
      content: "Want to secure your child's financial future early? Minor bank accounts can be opened by parents or legal guardians for children below 18 years of age. Some banks even offer special debit cards for minors above 10 years to teach them financial independence. Here is everything you need to know.",
      readTime: "5 min read",
      link: "/guides/banking/minor-bank-account"
    },
    {
      title: "Essential KYC Documents for Banking (2026 List)",
      content: "KYC (Know Your Customer) is a mandatory RBI requirement for all banking transactions. From opening an account to applying for a locker, banks require your Proof of Identity (POI) and Proof of Address (POA). Discover the universally accepted documents and how to do Video KYC from home.",
      readTime: "3 min read",
      link: "/guides/banking/kyc-documents-list"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-slate-400 items-center gap-2">
        <Link href="/" className="hover:text-cyan-400 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/guides" className="hover:text-cyan-400 transition-colors">GUIDES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-bold uppercase">BANKING</span>
      </nav>

      {/* Page Header (Cyan Theme for Banking) */}
      <div className="border-b border-slate-800 pb-8">
        <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">Banking Guides & Tutorials</h1>
        <p className="text-slate-300 text-lg">Comprehensive step-by-step guides to help you navigate banking processes, KYC requirements, and account management.</p>
      </div>

      {/* Articles Feed */}
      <div className="space-y-8">
        {articles.map((article, index) => (
          <article key={index} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Tutorial
              </span>
              <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {article.readTime}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">{article.title}</h2>
            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              {article.content}
            </p>
            
            <Link href={article.link} className="inline-flex text-cyan-400 font-bold hover:text-cyan-300 items-center gap-2 transition-colors">
              Read Full Article <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </article>
        ))}
      </div>

    </div>
  );
}