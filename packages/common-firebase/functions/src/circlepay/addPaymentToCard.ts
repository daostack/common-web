import { ICardEntity, IPaymentEntity } from '../util/types';
import { CommonError } from '../util/errors';
import { updateCard } from '../util/db/cardDb';

/**
 * Links payment with a card
 *
 * @param card - The card entity
 * @param payment - The payment entity
 *
 * @throws { CommonError } - If the id of the card is different from the payment's source id
 *
 * @returns - The card entity with the payment added
 */
export const addPaymentToCard = async (card: ICardEntity, payment: IPaymentEntity): Promise<ICardEntity> => {
  if (payment.source.type !== 'card' || card.id !== payment.source.id) {
    throw new CommonError(`
      Cannot add payment (${payment.id}) to card (${card.id}),
      because the source of the payment is not that card!
    `);
  }

  // If there are no payment with that id add it and save it
  if(!card.payments.some(paymentId => paymentId === payment.id)) {
    card.payments.push(payment.id);

    // await db.collection(Collections.Cards)
    //   .doc(card.id)
    //   .set(card);

    await updateCard(card);
  }

  return card;
};