'use client';

import { useLanguage } from '@/src/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 leading-relaxed space-y-4">
        <p>
          {t.footerDisclaimer}
        </p>
        <p className="tracking-wide">&copy; {new Date().getFullYear()} Pincode Club. All rights reserved. Global Operations.</p>
      </div>
    </footer>
  );
}
