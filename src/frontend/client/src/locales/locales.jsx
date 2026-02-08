import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from './en/translation.json';
import plTranslation from './pl/translation.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            pl: { translation: plTranslation }
        },
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: { escapeValue: false }
    });

export default i18n;