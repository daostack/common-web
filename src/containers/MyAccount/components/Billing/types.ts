import { Card, CommonPayment } from "@/shared/models";

export interface CardsState {
  loading: boolean;
  fetched: boolean;
  cards: Card[];
}

export interface ChangePaymentMethodState {
  payment: CommonPayment | null;
  isPaymentLoading: boolean;
  cardId: string;
}
