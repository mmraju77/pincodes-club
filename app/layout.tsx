import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { LanguageProvider } from '@/src/context/LanguageContext'; 
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatbot from '@/components/AIChatbot';
import GoogleTranslate from '@/components/GoogleTranslate';

export const metadata: Metadata = {
  title: "Pincode Club - India's Most Accurate PIN Code & IFSC Directory",
  description: "Instantly search and verify over 1.5 Lakh postal PIN codes and Bank IFSC codes across India. Accurate, lightning-fast, and highly reliable.",
  keywords: "PIN code, IFSC code, Indian post offices, bank branches, MICR code, postal directory"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          
          <GoogleTranslate />

          <Navbar />

          <main className="flex-grow w-full">
            {children}
          </main>

          {/* PHASE 12: SEO Authority Links (About, Contact, Privacy, Disclaimer) */}
          <div className="border-t border-slate-800/50 bg-[#0f172a]">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
              <Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link>
              <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
              <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
              <Link href="/disclaimer" className="hover:text-orange-400 transition-colors">Disclaimer</Link>
            </div>
          </div>

          <Footer />
          <AIChatbot />

        </LanguageProvider>
      </body>
    </html>
  );
}