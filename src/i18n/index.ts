import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { Language } from "@/shared/constants";
import locales from "./locales";

console.log(locales);
i18n.use(initReactI18next).init({
  resources: locales,
  fallbackLng: Language.English,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
