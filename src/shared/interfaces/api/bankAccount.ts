import { BankAccountDetails } from "@/shared/models";

export interface UpdateBankAccountDetailsData {
  idNumber: BankAccountDetails["socialId"];
  bankName: BankAccountDetails["bankName"];
  bankCode: BankAccountDetails["bankCode"];
  branchNumber: BankAccountDetails["branchNumber"];
  accountNumber: BankAccountDetails["accountNumber"];
  accountHolderFullName: string;
}
