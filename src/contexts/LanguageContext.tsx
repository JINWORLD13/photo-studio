"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Locale = "ko" | "en" | "ja";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: any;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [messages, setMessages] = useState<any>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const loadMessages = async (lang: Locale) => {
    setIsLoaded(false);
    try {
      const module = await import(`../locales/${lang}/common.json`);
      setMessages(module.default);
      setIsLoaded(true);
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
      setMessages({});
      setIsLoaded(true);
    }
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("language", newLocale);
    loadMessages(newLocale);
  };

  useEffect(() => {
    // localStorage에서 언어 불러오기
    const savedLang = localStorage.getItem("language") as Locale;
    const currentLang =
      savedLang && ["ko", "en", "ja"].includes(savedLang) ? savedLang : "ko";

    setLocaleState(currentLang);
    loadMessages(currentLang);

    // storage 이벤트 리스너 추가 (다른 탭에서 언어 변경 시)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "language" && e.newValue) {
        const newLang = e.newValue as Locale;
        if (["ko", "en", "ja"].includes(newLang)) {
          setLocaleState(newLang);
          loadMessages(newLang);
        }
      }
    };

    // custom event 리스너 추가 (같은 탭에서 언어 변경 시)
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newLang = customEvent.detail.language as Locale;
      if (["ko", "en", "ja"].includes(newLang)) {
        setLocaleState(newLang);
        loadMessages(newLang);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// useTranslation은 useLanguage를 래핑한 것
export function useTranslation() {
  const { locale, messages, isLoaded } = useLanguage();

  const t = (key: string, fallback?: string): string => {
    if (!isLoaded) return fallback || key;

    const keys = key.split(".");
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return fallback || key;
    }

    return value || fallback || key;
  };

  return { t, locale, isLoaded };
}
