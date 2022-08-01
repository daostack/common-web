import * as yup from "yup";
import { formatPrice } from "@/shared/utils";
import { FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH } from "./constants";
import { MIN_CONTRIBUTION_ILS_AMOUNT } from "@/shared/constants";

export const validationSchema = yup.object({
  title: yup.string()
    .max(FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH, "Entered title is too long")
    .required("Please enter proposal title"),
  description: yup.string().required("Please enter proposal description"),
  goalOfPayment: yup.string().required("Please enter goal of payment"),
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
