import { Language } from "@/shared/constants";

export type SupportersDataFields =
  | "aboutYou"
  | "furtherSupportPlan"
  | "marketingContentAgreement"
  | "whatsappGroupAgreement";

export interface SupportersDataFormFieldTranslation {
  label: string;
  placeholder?: string;
}

export interface SupportersDataTranslation {
  title: string;
  description: string;
  fields?: Partial<
    Record<SupportersDataFields, SupportersDataFormFieldTranslation>
  >;
  thankYouPageDescription: string;
}

export interface SupportersData {
  photoURL: string;
  amounts: number[];
  minAmount?: number;
  hiddenFields?: SupportersDataFields[];
  defaultLocale: Language;
  translations: Partial<Record<Language, SupportersDataTranslation>>;
}
