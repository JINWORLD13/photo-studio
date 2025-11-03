'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { businessInfo } from '@/config/business-info';

export default function TermsOfService() {
  const { t, locale } = useTranslation();
  const { messages } = useLanguage();
  const contact = businessInfo.contact[locale as 'ko' | 'en' | 'ja'];

  return (
    <div className="min-h-screen bg-stone-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 rounded-full mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-stone-600">{t('terms.lastUpdated')}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8"
        >
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section1.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed">
              {t('terms.section1.content')}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section2.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              {t('terms.section2.content')}
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-stone-700">
              {messages?.terms?.section2?.items && Array.isArray(messages.terms.section2.items) && 
                messages.terms.section2.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              }
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section3.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              {t('terms.section3.content')}
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-stone-700">
              {messages?.terms?.section3?.items && Array.isArray(messages.terms.section3.items) && 
                messages.terms.section3.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              }
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section4.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              {t('terms.section4.content')}
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-stone-700">
              {messages?.terms?.section4?.items && Array.isArray(messages.terms.section4.items) && 
                messages.terms.section4.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              }
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section5.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed">
              {t('terms.section5.content')}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section6.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              {t('terms.section6.content')}
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-stone-700">
              {messages?.terms?.section6?.items && Array.isArray(messages.terms.section6.items) && 
                messages.terms.section6.items.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))
              }
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.section7.title')}
            </h2>
            <p className="text-stone-700 leading-relaxed">
              {t('terms.section7.content')}
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-stone-200">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4">
              {t('terms.contact.title')}
            </h2>
            <div className="text-stone-700 space-y-2">
              <p>
                <span className="font-medium">{t('terms.contact.business')}:</span>{' '}
                {businessInfo.businessName}
              </p>
              <p>
                <span className="font-medium">{t('terms.contact.email')}:</span>{' '}
                <a href={`mailto:${contact.email}`} className="text-stone-900 hover:underline">
                  {contact.email}
                </a>
              </p>
              <p>
                <span className="font-medium">{t('terms.contact.phone')}:</span>{' '}
                <a href={contact.phoneHref} className="text-stone-900 hover:underline">
                  {contact.phone}
                </a>
              </p>
            </div>
          </section>
        </motion.div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            {t('terms.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}

