/**
 * @todo Write docs
 */
export interface ICardEntity {
  id: string;

  creationData: Date;

  userId: string;
  cardId: string;

  payments: string[];
  proposals: string[];
}