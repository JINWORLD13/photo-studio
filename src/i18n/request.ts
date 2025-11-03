import { getRequestConfig } from 'next-intl/server';
import { locales } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  let validatedLocale: string = locale || 'ko';
  if (!locales.includes(locale as any)) {
    validatedLocale = 'ko';
  }

  return {
    locale: validatedLocale,
    messages: (await import(`../locales/${validatedLocale}/common.json`)).default,
  };
});

