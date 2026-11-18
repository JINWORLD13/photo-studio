"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import koMessages from "../locales/ko/common.json";
import enMessages from "../locales/en/common.json";
import jaMessages from "../locales/ja/common.json";

type Locale = "ko" | "en" | "ja";

// 번역 파일을 번들에 정적으로 포함: 서버 렌더링(SSR)과 첫 화면부터 키 대신 문장이 나오도록 함
const MESSAGES: Record<Locale, any> = {
  ko: koMessages,
  en: enMessages,
  ja: jaMessages,
};

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
  // SSR과 클라이언트 일관성을 위해 기본값을 "ko"로 설정하고, 클라이언트에서만 localStorage 확인
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [messages, setMessages] = useState<any>(MESSAGES.ko);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const loadMessages = (lang: Locale) => {
    // 비동기 import 대신 정적 번들에서 바로 꺼냄(로딩 중 빈 메시지로 키가 노출되던 문제 수정)
    setMessages(MESSAGES[lang] || MESSAGES.ko);
    setIsLoaded(true);
  };

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", newLocale);
    }
    loadMessages(newLocale);
  };

  // 초기 로드: SSR과 클라이언트 일관성을 위해 기본값 "ko" 먼저 로드
  useEffect(() => {
    // 기본 언어(ko) 먼저 로드하여 SSR과 일치시킴
    loadMessages("ko");
    setIsMounted(true);
  }, []);

  // 클라이언트에서만 localStorage 확인하여 언어 변경
  useEffect(() => {
    if (!isMounted) return;

    // localStorage에서 언어 불러오기
    const savedLang = localStorage.getItem("language") as Locale;
    const currentLang =
      savedLang && ["ko", "en", "ja"].includes(savedLang) ? savedLang : "ko";

    // 저장된 언어가 현재 locale과 다르면 변경
    if (currentLang !== locale) {
      setLocaleState(currentLang);
      loadMessages(currentLang);
    }
  }, [isMounted, locale]);

  // storage 이벤트 리스너 추가 (다른 탭에서 언어 변경 시)
  useEffect(() => {
    if (!isMounted) return;

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
  }, [isMounted]);

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
    // SSR과 클라이언트 일관성을 위해: 메시지가 로드되지 않았을 때는 fallback 또는 key 반환
    // 하지만 hydration 오류를 방지하기 위해 항상 일관된 값을 반환해야 함
    if (!isLoaded || Object.keys(messages).length === 0) {
      // SSR과 초기 클라이언트 렌더링에서 일관성을 위해 fallback 또는 key 반환
      return fallback || key;
    }

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
