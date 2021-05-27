import * as z from 'zod';
import { BillingDetail, Country } from '@prisma/client';

import { logger } from '@logger';
import { prisma } from '@toolkits';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  name: z.string()
    .nonempty()
    .regex(/^[a-zA-Z'. ]*$/, 'You first name can only contain latin characters and spaces.'),

  city: z.string()
    .nonempty(),

  country: z.enum(Object.keys(Country) as [(keyof typeof Country)]),

  line1: z.string()
    .nonempty(),

  line2: z.string()
    .optional()
    .nullable(),

  district: z.string()
    .optional()
    .nullable(),

  postalCode: z.string()
    .nonempty()
});

export const createUserBillingDetailsCommand = async (command: z.infer<typeof schema>): Promise<BillingDetail> => {
  schema.parse(command);

  logger.info('Creating billing details');

  // Create the billing details
  const res = await prisma.billingDetail
    .create({
      data: command
    });


  logger.info('Successfully created billing details with ID');

  // Return the created billing details
  return res;
};