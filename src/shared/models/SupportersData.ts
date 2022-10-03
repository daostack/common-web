import { Language } from "@/shared/constants";

export interface SupportersDataTranslation {
  title: string;
  description: string;
  thankYouPageDescription: string;
}

export interface SupportersData {
  photoURL: string;
  amounts: number[];
  minAmount?: number;
  defaultLocale: Language;
  translations: Partial<Record<Language, SupportersDataTranslation>>;
}
