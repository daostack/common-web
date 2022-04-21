import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import {
  BankAccountDetails,
  Card,
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
  onBankAccountChange: (data: BankAccountDetails) => void;
  areContributionsLoading: boolean;
  contributions: (Payment | Subscription)[];
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
