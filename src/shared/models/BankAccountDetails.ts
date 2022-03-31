import { PaymeDocument } from "../interfaces/api/payMe";

export interface BankAccountDetails {
  bankName: string;
  bankCode: number;
  branchNumber: number;
  accountNumber: number;
  identificationDocs: PaymeDocument[];
  city: string;
  country: string;
  streetAddress: string;
  streetNumber: number;
  socialId: string;
  socialIdIssueDate: string;
  birthdate: string;
  gender: number;
  phoneNumber: string;
}
