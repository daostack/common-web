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
  successPageDescription: string;
  successPageInfoBlockDescription: string;
  welcomePageDescription: string;
  welcomePageRulesDescription: string;
}

export interface SupportersData {
  id: string;
  commonId: string;
  photoURL: string;
  amounts: number[];
  minAmount?: number;
  hiddenFields?: SupportersDataFields[];
  defaultLocale: Language;
  translations: Partial<Record<Language, SupportersDataTranslation>>;
}
