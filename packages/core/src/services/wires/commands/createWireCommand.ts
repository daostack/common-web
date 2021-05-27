import * as z from 'zod';
import { v4 } from 'uuid';
import { EventType, Wire } from '@prisma/client';

import { logger } from '@logger';
import { circleClient } from '@clients';
import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';
import { eventService } from '@services';

const schema = z.object({
  iban: z.string()
    .optional(),

  accountNumber: z.string()
    .optional(),

  routingNumber: z.string()
    .optional(),

  billingDetailsId: z.string()
    .nonempty(),

  wireBankDetailsId: z.string()
    .nonempty(),

  userId: z.string()
    .nonempty()
})
  .refine((d) => {
    return !(d.iban && (d.accountNumber || d.routingNumber));
  }, 'You can only have either IBAN or account/routing number');

export const createWireCommand = async (command: z.infer<typeof schema>): Promise<Wire> => {
  schema.parse(command);

  logger.info('Creating new wires');

  const { wireBankDetailsId, billingDetailsId, userId, ...accountData } = command;

  // Find the bank account details and the user billing details
  const billing = await prisma.billingDetail
    .findUnique({
      where: {
        id: billingDetailsId
      }
    });

  const wireBankDetails = await prisma.wireBankDetail
    .findUnique({
      where: {
        id: wireBankDetailsId
      }
    });

  if (!wireBankDetails || !billing) {
    throw new NotFoundError(
      'Unable to found either the wires details or the billing details',
      `billing:${billingDetailsId},wire:${wireBankDetailsId}`
    );
  }

  // Create the wires with circle
  const { data: circleResponse } = await circleClient.wires.create({
    idempotencyKey: v4(),
    billingDetails: billing,
    bankAddress: wireBankDetails,
    ...accountData
  });

  // Create the wires in the database
  const wire = await prisma.wire
    .create({
      data: {
        circleId: circleResponse.id,
        circleFingerprint: circleResponse.fingerprint,
        description: circleResponse.description,

        userId,
        wireBankDetailId: wireBankDetailsId,
        billingDetailId: billingDetailsId
      }
    });

  // Create the event
  eventService.create({
    type: EventType.WireCreated,
    userId
  });

  logger.info(`Successfully created new wire with ID `);

  return wire;
};