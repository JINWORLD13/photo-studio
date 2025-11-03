'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Language = 'ko' | 'en' | 'ja';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode: Language) => {
    setLocale(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="relative">
      {/* 언어 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 lg:px-3 lg:py-2 rounded-lg hover:bg-stone-100 transition-colors"
        aria-label="언어 선택"
      >
        <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-stone-600" />
        <span className="text-xs lg:text-sm font-medium text-stone-700 whitespace-nowrap">
          {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
        </span>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 (모바일용) */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 언어 선택 메뉴 */}
          <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as Language)}
                className={`w-full text-left px-4 py-2.5 hover:bg-stone-50 transition-colors flex items-center space-x-3 ${
                  locale === lang.code ? 'bg-stone-100' : ''
                }`}
              >
                <span className="text-xl sm:text-2xl">{lang.flag}</span>
                <span className="text-sm font-medium text-stone-700 flex-1">
                  {lang.name}
                </span>
                {locale === lang.code && (
                  <span className="text-stone-900">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

