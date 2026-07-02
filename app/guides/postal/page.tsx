import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Postal Guides & Speed Post Tracking Tutorials | Pincode Club',
  description: 'Learn how to use India Post services, track your speed post, and find correct pincodes easily.',
};

export default function PostalGuidesPage() {
  const articles = [
    {
      title: "How to Track Speed Post (Step-by-Step)",
      content: "Speed Post is India Post's high-speed postal service. To track your parcel, locate the 13-digit alphanumeric consignment number (e.g., EE123456789IN) on your receipt. Enter this number in the India Post tracking portal to see real-time status updates from booking to delivery.",
      readTime: "3 min read",
      link: "/guides/postal/speed-post-tracking"
    },
    {
      title: "Why is the Correct Pincode Important?",
      content: "A PIN (Postal Index Number) is a 6-digit code. The first digit represents the region, the second the sub-region, the third the sorting district, and the last three digits represent the specific post office. Using the exact Pincode ensures your mail reaches the destination without manual sorting delays.",
      readTime: "4 min read",
      link: "/guides/postal/correct-pincode"
    },
    {
      title: "India Post Saving Schemes (2026 Update)",
      content: "Post offices in India offer some of the most secure and high-yielding saving schemes, such as the Public Provident Fund (PPF), Sukanya Samriddhi Yojana (SSY), and Kisan Vikas Patra (KVP). These schemes offer sovereign guarantee and excellent tax benefits under Section 80C.",
      readTime: "5 min read",
      link: "/guides/postal/saving-schemes"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-10 min-h-screen">
      
      <nav className="flex text-sm text-slate-400 items-center gap-2">
        <Link href="/" className="hover:text-blue-400 transition-colors">HOME</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <Link href="/guides" className="hover:text-blue-400 transition-colors">GUIDES</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        <span className="text-white font-bold uppercase">POSTAL</span>
      </nav>

      <div className="border-b border-slate-800 pb-8">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4">India Post & Postal Guides</h1>
        <p className="text-slate-300 text-lg">Comprehensive tutorials to help you master postal services, tracking, and saving schemes in India.</p>
      </div>

      <div className="space-y-8">
        {articles.map((article, index) => (
          <article key={index} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
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
            
            <Link href={article.link} className="inline-flex text-blue-400 font-bold hover:text-blue-300 items-center gap-2 transition-colors">
              Read Full Article <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </article>
        ))}
      </div>

    </div>
  );
}