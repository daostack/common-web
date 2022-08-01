import * as yup from "yup";
import { formatPrice } from "@/shared/utils";
import { MIN_CONTRIBUTION_ILS_AMOUNT } from "@/shared/constants";

export const validationSchema = yup.object({
  commonBalance: yup.number(),
  amount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(MIN_CONTRIBUTION_ILS_AMOUNT / 100,  `The amount requested cannot be less than ${formatPrice(
      MIN_CONTRIBUTION_ILS_AMOUNT,
      { shouldRemovePrefixFromZero: false }
    )}.`)
    .max(
      yup.ref("commonBalance"),
      ({ max }) =>
        `The amount requested cannot be greater than the Common balance (${formatPrice(
          max * 100,
          { shouldRemovePrefixFromZero: false }
        )}).`
    ),
  bankAccountDetails: yup.object().required(),
});
