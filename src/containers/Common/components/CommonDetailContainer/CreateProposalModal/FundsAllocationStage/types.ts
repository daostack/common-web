import { CommonLink } from "@/shared/models";
import { ProposalImage } from "@/shared/models/governance/proposals";

export type FundType = 'ILS' | 'Dollars' | 'Token';

export type RecipientType = 'Member' | 'Members' | 'Circles' | '3rd Party';

export interface FundsAllocationData {
  title: string;
  description: string;
  goalOfPayment: string;
  fund: FundType;
  amount: number;
  links: CommonLink[];
  images: ProposalImage[];
}
