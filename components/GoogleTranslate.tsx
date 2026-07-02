'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document.body.appendChild(addScript);
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          // 🚀 We must strictly mention all language codes here for them to work
          includedLanguages: 'en,te,hi,ta,kn',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  return <div id="google_translate_element" className="hidden"></div>;
}