import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationDE from './locales/de/translation.json';
import translationEN from './locales/en/translation.json';
import translationDA from './locales/da/translation.json';

const resources = {
  de: {
    translation: translationDE
  },
  en: {
    translation: translationEN
  },
  da: {
    translation: translationDA
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Set English as default language
    fallbackLng: 'en', // Changed from 'de' to 'en'
    debug: false,
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
