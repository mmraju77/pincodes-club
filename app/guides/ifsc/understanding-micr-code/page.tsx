import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'What is MICR Code? Format & Anatomy Explained | Pincode Club',
  description: 'Understand what a 9-digit MICR code is, where to find it on a cheque, and how it speeds up the cheque clearing process.',
};

export default function MicrArticle() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 min-h-screen">
      <nav className="flex text-sm text-slate-400 items-center gap-2 mb-10">
        <Link href="/" className="hover:text-sky-400 transition-colors">HOME</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides" className="hover:text-sky-400 transition-colors">GUIDES</Link>
        <span className="text-slate-600">/</span>
        <Link href="/guides/ifsc" className="hover:text-sky-400 transition-colors">IFSC</Link>
        <span className="text-slate-600">/</span>
        <span className="text-white font-bold">MICR CODE</span>
      </nav>

      <article className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          What is a MICR Code and How to Read It?
        </h1>
        
        <div className="flex items-center gap-4 border-b border-slate-800 pb-8 mb-8">
          <span className="bg-sky-500/10 text-sky-400 text-sm font-bold px-4 py-1.5 rounded-full">Bank Codes</span>
          <span className="text-slate-400 text-sm">Read Time: 4 min</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-6">
          <p>
            MICR stands for <strong>Magnetic Ink Character Recognition</strong>. It is a 9-digit numeric code that is printed at the bottom of a cheque leaf using special magnetic ink. Its primary purpose is to make the processing and clearance of cheques faster and error-free.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8">Anatomy of a 9-Digit MICR Code</h2>
          <p>The 9 digits are not random; they are divided into three distinct parts, each containing 3 digits:</p>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>First 3 Digits (City Code):</strong> Represents the city where the bank branch is located. It aligns with the PIN code used for postal addresses. For example, Mumbai is 400.</li>
            <li><strong>Next 3 Digits (Bank Code):</strong> Represents the specific bank. Every bank in India has a unique 3-digit code assigned by the RBI. For example, SBI is 002.</li>
            <li><strong>Last 3 Digits (Branch Code):</strong> Represents the specific branch of that bank in that city.</li>
          </ul>

          <p className="mt-6">
            When a cheque is deposited, reading machines quickly scan this magnetic ink code, instantly identifying the city, bank, and branch to route the cheque for automated clearing.
          </p>
        </div>
      </article>
    </div>
  );
}