import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Track Speed Post Online: Step-by-Step Guide | Pincode Club',
  description: 'Learn exactly how to track your India Post Speed Post parcel online using your 13-digit consignment number.',
};

export default function SpeedPostArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-blue-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-blue-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/postal" className="hover:text-blue-400 transition-colors">POSTAL</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">SPEED POST TRACKING</span>
      </nav>

      {/* Article Content */}
      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          How to Track Speed Post Online (Step-by-Step Guide)
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-blue-500/10 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full">
            India Post
          </span>
          <span className="text-slate-400 text-sm">Updated: July 2026</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>
            Speed Post is the premium postal service provided by India Post. It offers high-speed delivery of letters and parcels with a time-bound delivery guarantee. The best part? You can track its journey in real-time.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 1: Find your Consignment Number</h2>
          <p>
            When you book a Speed Post, the post office gives you a receipt. Look for a 13-digit alphanumeric number printed on it. It usually starts with 'E' and ends with 'IN' (For example: <strong>EE123456789IN</strong>). This is your tracking ID.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 2: Visit the Official Portal</h2>
          <p>
            Go to the official <a href="https://www.indiapost.gov.in" target="_blank" className="text-blue-400 hover:underline">India Post website</a>. On the homepage, you will see a tool called "Track N Trace".
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Step 3: Enter Details and Search</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Type your 13-digit consignment number carefully.</li>
            <li>Solve the simple math captcha (e.g., 5 + 3) for security.</li>
            <li>Click on the <strong>Search</strong> button.</li>
          </ul>

          <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl mt-8">
            <h3 className="text-lg font-bold text-blue-400 mb-2">Pro Tip 💡</h3>
            <p className="text-sm">
              Status showing "Item Bagged" means your parcel is packed and ready to leave the sorting hub. "Item Dispatched" means it is currently on its way to your city!
            </p>
          </div>
        </div>
      </article>

    </div>
  );
}