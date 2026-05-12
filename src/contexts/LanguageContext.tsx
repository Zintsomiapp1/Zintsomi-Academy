import React, { createContext, useContext, useMemo, useState } from 'react';

export type SupportedLanguage = 'en' | 'zu' | 'xh' | 'st';

const STORAGE_KEY = 'zintsomi_language';

const labels: Record<SupportedLanguage, string> = {
  en: 'English',
  zu: 'isiZulu',
  xh: 'isiXhosa',
  st: 'Sesotho',
};

const translations = {
  welcomeTitleTop: {
    en: 'Find Your',
    zu: 'Thola',
    xh: 'Fumana',
    st: 'Fumana',
  },
  welcomeTitleBottom: {
    en: 'Perfect Match',
    zu: 'Uthando Olufanele',
    xh: 'Uthando Olugqibeleleyo',
    st: 'Lerato la Hao',
  },
  welcomeSubtitle: {
    en: "Africa's most exciting dating platform. Connect authentically and find love.",
    zu: 'Inkundla yokuthandana eshisa izikhotha e-Afrika. Xhumana ngobuqotho uthole uthando.',
    xh: 'Iqonga lokuthandana elonwabisayo eAfrika. Nxibelelana ngokwenene ufumane uthando.',
    st: 'Sethala sa ho ratana se monate Afrika. Hokahana ka nnete mme o fumane lerato.',
  },
  createAccount: {
    en: 'Create Account',
    zu: 'Dala i-Akhawunti',
    xh: 'Yenza iAkhawunti',
    st: 'Bopa Akhaonto',
  },
  signIn: {
    en: 'Sign In',
    zu: 'Ngena',
    xh: 'Ngena',
    st: 'Kena',
  },
  profileReady: {
    en: 'Ready to find love ✨',
    zu: 'Usukulungele ukuthola uthando ✨',
    xh: 'Ukulungele ukufumana uthando ✨',
    st: 'O se o itokiselitse ho fumana lerato ✨',
  },
  streak: {
    en: 'day streak',
    zu: 'izinsuku zilandelana',
    xh: 'iintsuku zilandelelana',
    st: 'matsatsi a latellanang',
  },
  discoverLove: {
    en: 'Discover Love',
    zu: 'Thola Uthando',
    xh: 'Fumana Uthando',
    st: 'Fumana Lerato',
  },
  startSwiping: {
    en: 'Start Swiping',
    zu: 'Qala Ukubuka',
    xh: 'Qala Ukuswayipa',
    st: 'Qala ho Swaepa',
  },
  onboardingTitle: {
    en: 'Quick setup',
    zu: 'Ukusetha okusheshayo',
    xh: 'Ukuseta ngokukhawuleza',
    st: 'Tlhophiso e potlakileng',
  },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
  languageLabels: typeof labels;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
  return saved && saved in labels ? saved : 'en';
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  };

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key: TranslationKey) => translations[key][language] ?? translations[key].en,
    languageLabels: labels,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};
