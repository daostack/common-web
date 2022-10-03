import { Language } from "@/shared/constants";

interface SupportersDataTranslation {
  title: string;
  description: string;
  thankYouPageDescription: string;
}

export interface SupportersData {
  photoURL: string;
  amounts: number[];
  defaultLocale: Language;
  translations: Partial<Record<Language, SupportersDataTranslation>>;
}
