'use client';
import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    // Prevent loading the script twice
    if (document.getElementById('google-translate-script')) return;

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,te,hi,ta,kn', // English, Telugu, Hindi, Tamil, Kannada
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" className="hidden"></div>;
}