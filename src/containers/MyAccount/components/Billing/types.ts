import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import {
  BankAccountDetails,
  Card,
  Common,
  Payment,
  Subscription,
} from "@/shared/models";

export interface BillingProps {
  areCardsLoading: boolean;
  cards: Card[];
  isBankAccountLoading: boolean;
  bankAccount: BankAccountDetails | null;
  changePaymentMethodState: ChangePaymentMethodState;
  onPaymentMethodChange: () => void;
  onChangePaymentMethodStateClear: () => void;
  onBankAccountChange: (data: BankAccountDetails | null) => void;
  areContributionsLoading: boolean;
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  contributionCommons: Common[];
  activeContribution: Payment | Subscription | null;
  onActiveContributionSelect: (contribution: Payment | Subscription | null) => void;
  onActiveSubscriptionUpdate: (subscription: Subscription) => void;
}

export interface CardsState {
  loading: boolean;
  fetched: boolean;
  cards: Card[];
}

export interface BankAccountState {
  loading: boolean;
  fetched: boolean;
  bankAccount: BankAccountDetails | null;
}
