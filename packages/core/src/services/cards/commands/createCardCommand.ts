import * as z from 'zod';
import { Card, EventType } from '@prisma/client';

import { prisma } from '../../../domain/toolkits/index';
import { circleClient } from '../../../domain/clients/index';
import { eventService } from '../../index';
import { BillingDetailsSchema } from '../../../domain/validation/index';

import { verifyCardCommand } from './verifyCardCommand';
import { logger } from '../../../domain/utils/logger';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  keyId: z.string()
    .nonempty(),

  ipAddress: z.string()
    .nonempty(),

  encryptedData: z.string()
    .nonempty(),

  expMonth: z
    .number()
    .min(1)
    .max(12),

  expYear: z
    .number()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 50),

  billingDetails: BillingDetailsSchema
});

export const createCardCommand = async (command: z.infer<typeof schema>): Promise<Card> => {
  schema.parse(command);

  logger.debug('Creating card from valid payload', {
    payload: command
  });

  const {
    ipAddress,
    userId,
    ...circlePayload
  } = command;

  const { data: circleResponse } = await circleClient.cards.create({
    ...circlePayload,
    idempotencyKey: 'b816af39-eacd-4278-b24b-3c646e69e9f2',
    metadata: {
      // @todo Real data
      email: 'test@mail.com',
      ipAddress: command.ipAddress,
      sessionId: 'dsrh2jfp3ewojfsknbhgsoetjrelfd'
    }
  });

  logger.debug('Card created with circle, creating local card entity', {
    circleResponse
  });


  // Create the card
  const card = await prisma.card.create({
    data: {
      circleCardId: circleResponse.id,

      digits: circleResponse.last4,
      network: circleResponse.network,

      avsCheck: circleResponse.verification.avs,
      cvvCheck: circleResponse.verification.cvv,

      billingDetails: {
        create: circleResponse.billingDetails
      },

      user: {
        connect: {
          id: userId
        }
      }
    }
  });

  // Create event for the card
  await eventService.create({
    type: EventType.CardCreated,
    userId
  });

  // Verify the created card
  await verifyCardCommand(card, {
    throwOnFailure: true
  });

  logger.debug('Card created and verified', {
    cardId: card.id
  });

  // Return the created card
  return card;
};