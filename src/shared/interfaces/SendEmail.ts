export enum EmailType {
  ContactUsAdmin = "CONTACT_US_ADMIN",
}

export interface SendEmail {
  senderEmail: string;
  senderName: string;
  type: EmailType;
  text: string;
}
