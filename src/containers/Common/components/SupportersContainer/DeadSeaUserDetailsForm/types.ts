export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  about: string;
  supportPlan: string;
  marketingContentAgreement?: boolean;
  whatsappGroupAgreement?: boolean;
}

export type FormValuesWithoutUserDetails = Omit<
  FormValues,
  "firstName" | "lastName" | "email" | "country" | "phoneNumber" | "about"
>;
