import * as z from 'zod';

const isDistrictRequired = (country: string): boolean =>
  country === 'US' || country === 'CA';

export const BankAccountSchema = z
  .object({
    bankName: z.string()
      .nonempty(),

    city: z.string()
      .nonempty(),

    country: z.string()
      .nonempty(),

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
  }).refine((data) => {
    return isDistrictRequired(data.country) ? !!data.district : true;
  });