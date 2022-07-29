import { CommonLink } from "@/shared/models";

export enum FundType {
  ILS = 'ILS',
  USD = 'USD',
  Token = 'Token',
}

export type RecipientType = 'Member' | 'Members' | 'Circles' | '3rd Party';

export interface FundsAllocationData {
  title: string;
  description: string;
  goalOfPayment: string;
  fund: FundType;
  amount: number;
  links: CommonLink[];
}
