import { PaymeDocument } from "../interfaces/api/payMe";
import { Gender } from "./Gender";

export interface BankAccountDetails {
  bankCode: number;
  branchNumber: number;
  accountNumber: number;
  identificationDocs: PaymeDocument[];
  city: string;
  country: string;
  streetAddress: string;
  streetNumber: number;
  firstName: string;
  lastName: string;
  socialId: string;
  socialIdIssueDate: string;
  birthdate: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
}
