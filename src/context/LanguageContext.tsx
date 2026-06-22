'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: Record<string, string>;
};

// FULL TRANSLATIONS FOR NAVBAR & UI
const translations: Record<string, Record<string, string>> = {
  en: { home: "HOME", pincodes: "PIN CODES", ifsc: "IFSC DIRECTORY", about: "ABOUT US" },
  te: { home: "హోమ్", pincodes: "పిన్ కోడ్స్", ifsc: "IFSC డైరెక్టరీ", about: "మా గురించి" },
  hi: { home: "होम", pincodes: "पिन कोड", ifsc: "IFSC निर्देशिका", about: "हमारे बारे में" },
  ta: { home: "முகப்பு", pincodes: "பின் குறியீடுகள்", ifsc: "IFSC கோப்பகம்", about: "எங்களை பற்றி" },
  kn: { home: "ಮುಖಪುಟ", pincodes: "ಪಿನ್ ಕೋಡ್‌ಗಳು", ifsc: "IFSC ಡೈರೆಕ್ಟರಿ", about: "ನಮ್ಮ ಬಗ್ಗೆ" },
};

// REGIONAL DICTIONARY (Expands automatically for SEO)
const regionalDictionary: Record<string, Record<string, string>> = {
  'te': { 'visakhapatnam': 'విశాఖపట్నం', 'andhra pradesh': 'ఆంధ్ర ప్రదేశ్', 'state bank of india': 'స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా' },
  'hi': { 'visakhapatnam': 'विशाखापत्तनम', 'andhra pradesh': 'आंध्र प्रदेश', 'state bank of india': 'स्टेट बैंक ऑफ इंडिया' },
  'ta': { 'visakhapatnam': 'விசாகப்பட்டினம்', 'andhra pradesh': 'ஆந்திரப் பிரதேசம்', 'state bank of india': 'பாரத ஸ்டேட் வங்கி' },
  'kn': { 'visakhapatnam': 'ವಿಶಾಖಪಟ್ಟಣಂ', 'andhra pradesh': 'ಆಂಧ್ರಪ್ರದೇಶ', 'state bank of india': 'ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ' },
};

export const translateName = (text: string, lang: string) => {
  if (lang === 'en' || !text) return text;
  const lowerText = text.toLowerCase();
  return regionalDictionary[lang]?.[lowerText] || text;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');
  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}