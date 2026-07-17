// @ts-nocheck
import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/src/context/LanguageContext'; 
import Navbar from '@/components/Navbar';
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
      <head>
        {/* 🚀 Google Search Console Verification */}
        <meta name="google-site-verification" content="JwQ3VyOZUSB3OqbynuAo8kIpDUAESN5fHW8hnU0MuoU" />

        {/* 💰 STRATEGIC ADSENSE SCRIPT */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      
      <body className="min-h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
          
          <GoogleTranslate />

          <Navbar />

          <main className="flex-grow w-full pb-16">
            {children}
          </main>

          {/* 🚀 UNIFIED FOOTER: Removed the separate black footer and merged copyright text seamlessly */}
          <footer className="mt-auto border-t border-slate-800/50 bg-[#0f172a] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center gap-5">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 font-medium">
                <Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
                <Link href="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
                <Link href="/disclaimer" className="hover:text-orange-400 transition-colors">Disclaimer</Link>
              </div>
              <p className="text-slate-600 text-xs text-center font-medium">
                &copy; 2026 Pincode Club. All rights reserved. Global Operations.
              </p>
            </div>
          </footer>

          <AIChatbot />

        </LanguageProvider>
      </body>
    </html>
  );
}