'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const pathname = usePathname();

  // Language Options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
  ];

  const changeLanguage = (code: string) => {
    setCurrentLang(code);
    setLangMenuOpen(false);
    // Google Translate Trigger
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl py-4 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* 1. Bold Logo (PINCODE CLUB) */}
          <Link href="/" className="flex items-center gap-3 group" translate="no">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              PINCODE<span className="text-orange-500">CLUB</span>
            </span>
          </Link>

          {/* 2. Desktop Menu Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">HOME</Link>
            <Link href="/pin-codes" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">PIN CODES</Link>
            <Link href="/ifsc-directory" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">IFSC DIRECTORY</Link>
            
            {/* 🚀 New GUIDES Link Added Here */}
            <Link href="/guides" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">GUIDES</Link>

            {/* 3. Language Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-sm font-bold text-white px-4 py-2 rounded-lg transition-colors"
                translate="no"
              >
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                {languages.find(l => l.code === currentLang)?.name?.split(' ')[0] || 'English'}
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-4 py-2 text-sm font-bold hover:bg-orange-500 hover:text-white transition-colors"
                      translate="no"
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}