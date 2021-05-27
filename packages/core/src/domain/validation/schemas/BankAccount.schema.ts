import * as z from 'zod';
import { UserCountry } from '@prisma/client';

const isDistrictRequired = (country: string): boolean =>
  country === 'US' || country === 'CA';

export const BankAccountSchema = z
  .object({
    bankName: z.string()
      .nonempty(),

    city: z.string()
      .nonempty(),

    country: z.enum(Object.keys(UserCountry) as [(keyof typeof UserCountry)]),

    line1: z.string()
      .optional()
      .nullable(),

    line2: z.string()
      .optional()
      .nullable(),

    district: z.string()
      .optional()
      .nullable(),

    postalCode: z.string()
      .nonempty()
  }).refine((data) => {
    return isDistrictRequired(data.country) ? !!data.district : true;
  });