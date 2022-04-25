import { BankAccountDetails } from "@/shared/models";

export interface UpdateBankAccountDetailsData {
  bankName: BankAccountDetails["bankName"];
  bankCode: BankAccountDetails["bankCode"];
  branchNumber: BankAccountDetails["branchNumber"];
  accountNumber: BankAccountDetails["accountNumber"];
  accountHolderFullName: string;
  socialId: BankAccountDetails["socialId"];
  socialIdIssueDate: BankAccountDetails["socialIdIssueDate"];
}
