import { BankAccountDetails } from "@/shared/models";

export interface UpdateBankAccountDetailsData {
  idNumber: BankAccountDetails["socialId"];
  bankName: BankAccountDetails["bankName"];
  branchNumber: BankAccountDetails["branchNumber"];
  accountNumber: BankAccountDetails["accountNumber"];
  accountHolderFullName: string;
}
