import * as z from 'zod';
import { Card } from '@prisma/client';
import { circleClient } from '@toolkits';
import { BillingDetailsSchema } from '@validation';

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

  const {
    ipAddress,
    userId,
    ...circlePayload
  } = command;


  const circleResponse = await circleClient.cards.create({
    ...circlePayload,
    idempotencyKey: 'b816af39-eacd-4278-b24b-3c646e69e9f2',
    metadata: {
      email: 'test@mail.com',
      ipAddress: '127.0.0.1',
      sessionId: 'dsrh2jfp3ewojfsknbhgsoetjrelfd'
    }
  });

  console.log(circleResponse);

  throw new Error();
};