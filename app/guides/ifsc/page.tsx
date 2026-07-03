import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IFSC & MICR Code Tutorials | Pincode Club',
  description: 'Understand how NEFT, RTGS, and IMPS work. Learn the differences between IFSC, MICR, and SWIFT codes for safe banking.',
};

export default function IFSCGuidesPage() {
  const articles = [
    {
      title: "Understanding Digital Payments: NEFT, RTGS & IMPS",
      content: "Whenever you transfer money online, you use one of these three systems. But which one should you choose? Learn the transfer limits, processing timings, and charges for NEFT, RTGS, and IMPS, and why an IFSC code is mandatory for all of them.",
      readTime: "5 min read",
      link: "/guides/ifsc/neft-rtgs-imps-differences"
    },
    {
      title: "What is a MICR Code and How to Read It?",
      content: "MICR (Magnetic Ink Character Recognition) is a 9-digit code printed on the bottom of your bank cheque. Unlike IFSC, which is used for online transfers, MICR is specifically used for clearing cheques faster. Discover what each digit in the MICR code represents.",
      readTime: "4 min read",
      link: "/guides/ifsc/understanding-micr-code"
    },
    {
      title: "IFSC Code vs SWIFT Code: What's the Difference?",
      content: "Sending money to another state in India? You need an IFSC code. Sending money to another country? You need a SWIFT code. Understand the structural differences between these two crucial banking codes and when to use which.",
      readTime: "3 min read",
      link: "/guides/ifsc/ifsc-vs-swift-codes"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex text-sm text-slate-400 items-center gap-2">
        <Link href="/" className="hover:text-sky-400 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/guides" className="hover:text-sky-400 transition-colors">GUIDES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-bold uppercase">IFSC & MICR</span>
      </nav>

      {/* Page Header (Sky Theme) */}
      <div className="border-b border-slate-800 pb-8">
        <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20">
          <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">IFSC & MICR Tutorials</h1>
        <p className="text-slate-300 text-lg">Master digital transactions, cheque clearings, and understand the core routing codes of Indian banking.</p>
      </div>

      {/* Articles Feed */}
      <div className="space-y-8">
        {articles.map((article, index) => (
          <article key={index} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-sky-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-sky-500/10 text-sky-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Guide
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
            
            <Link href={article.link} className="inline-flex text-sky-400 font-bold hover:text-sky-300 items-center gap-2 transition-colors">
              Read Full Article <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </article>
        ))}
      </div>

    </div>
  );
}