import * as yup from "yup";
import { formatPrice } from "@/shared/utils";
import { FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH } from "./constants";

export const configurationValidationSchema = yup.object().shape({
  title: yup
    .string()
    .max(FUNDS_ALLOCATION_PROPOSAL_TITLE_LENGTH, "Entered title is too long")
    .required("Please enter a title for the proposal"),
  description: yup
    .string()
    .required("Please enter a description for the proposal"),
  goalOfPayment: yup.string().required("Please enter goal of payment"),
});

export const fundDetailsValidationSchema = yup.object({
  commonBalance: yup.number(),
  amount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .max(
      yup.ref("commonBalance"),
      ({ max }) =>
        `The amount requested cannot be greater than the Common balance (${formatPrice(
          max * 100,
          { shouldRemovePrefixFromZero: false }
        )}).`
    ),
});

export const fundAllocationValidationSchema = configurationValidationSchema.concat(fundDetailsValidationSchema);
