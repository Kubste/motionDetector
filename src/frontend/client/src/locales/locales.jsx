import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './translations/enTranslation.json';
import plTranslation from './translations/plTranslation.json';
import deTranslation from './translations/deTranslation.json';
import esTranslation from './translations/esTranslation.json';
import frTranslation from './translations/frTranslation.json';
import ptTranslation from './translations/ptTranslation.json';
import ukTranslation from './translations/ukTranslation.json';
import zhTranslation from './translations/zhTranslation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            pl: { translation: plTranslation },
            de: { translation: deTranslation },
            es: { translation: esTranslation },
            fr: { translation: frTranslation },
            pt: { translation: ptTranslation },
            uk: { translation: ukTranslation },
            zh: { translation: zhTranslation }
        },
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: { escapeValue: false }
    });

export default i18n;