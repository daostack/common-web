export enum EmailType {
  ContactUsAdmin = "CONTACT_US_ADMIN",
}

export interface SendEmail {
  receiver: string;
  type: EmailType;
  text: string;
}
