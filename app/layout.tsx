import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/src/context/LanguageContext'; // ఇక్కడ మళ్ళీ యాడ్ చేశాం
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
        {/* ఇక్కడ LanguageProvider ని మళ్ళీ కనెక్ట్ చేశాం */}
        <LanguageProvider>
          
          <GoogleTranslate />

          <Navbar />

          <main className="flex-grow w-full">
            {children}
          </main>

          <Footer />
          <AIChatbot />

        </LanguageProvider>
      </body>
    </html>
  );
}