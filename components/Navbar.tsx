'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' }
  ];

  useEffect(() => {
    // Check if user already selected a language before
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2]) {
      const lang = match[2].split('/')[2];
      if (lang) setCurrentLang(lang);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setLangMenuOpen(false);

    // 1. Set Google Translate Cookies
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;

    // 2. Trigger Google Translate magic silently
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // Fallback: Reload page to apply translation if select element is not ready
      window.location.reload();
    }
  };

  return (
    <nav className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo (translate="no" prevents Google from translating our brand name) */}
          <Link href="/" className="flex items-center gap-3 group" translate="no">
            <div className="bg-white p-2 rounded-xl group-hover:scale-105 transition-transform">
              <span className="text-2xl">📍</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              PINCODE<span className="text-orange-500">CLUB</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors tracking-wider">HOME</Link>
            <Link href="/pin-codes" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors tracking-wider">PIN CODES</Link>
            <Link href="/ifsc-directory" className="text-sm font-bold text-slate-300 hover:text-orange-500 transition-colors tracking-wider">IFSC DIRECTORY</Link>
            
            {/* Custom Language Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors text-sm font-semibold"
                translate="no"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                {languages.find(l => l.code === currentLang)?.name.split(' ')[0]}
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-2 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-500 hover:text-white transition-colors ${currentLang === lang.code ? 'text-orange-400 font-bold' : 'text-slate-300'}`}
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
    </nav>
  );
}