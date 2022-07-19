import { Circle, CommonMemberWithUserInfo } from "@/shared/models";

export type FundType = 'ILS' | 'Dollars' | 'Token';

export type RecipientType = 'Member' | 'Members' | 'Circles' | '3rd Party';

export interface FundsAllocationData {
  title: string;
  description: string;
  goalOfPayment: string;
  fund: FundType;
  amount: number;
}
