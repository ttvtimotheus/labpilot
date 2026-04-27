import { createInstance } from 'i18next';
import * as Localization from 'expo-localization';
import { initReactI18next } from 'react-i18next';

import { resources } from '@/src/lib/i18n/resources';

const locale = Localization.getLocales()[0]?.languageCode ?? 'de';
const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: locale in resources ? locale : 'de',
  fallbackLng: 'de',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
