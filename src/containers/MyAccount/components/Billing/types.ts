import { Card } from "@/shared/models";

export interface CardsState {
  loading: boolean;
  fetched: boolean;
  cards: Card[];
}
