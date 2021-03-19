import * as z from 'zod';
import { Card } from '@prisma/client';

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
    .max(new Date().getFullYear() + 50)
});

export const createCardCommand = (command: z.infer<typeof schema>): Promise<Card> => {

}