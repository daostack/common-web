import * as z from 'zod';
import { WireBankDetail } from '@prisma/client';

import { BankAccountSchema } from '@validation';
import { logger } from '@logger';
import { prisma } from '@toolkits';

export const createWireBankDetailsCommand = async (command: z.infer<typeof BankAccountSchema>): Promise<WireBankDetail> => {
  BankAccountSchema.parse(command);

  logger.info('Creating new bank account details');

  const details = await prisma.wireBankDetail
    .create({
      data: command
    });

  logger.info('Successfully created bank account details');

  return details;
};