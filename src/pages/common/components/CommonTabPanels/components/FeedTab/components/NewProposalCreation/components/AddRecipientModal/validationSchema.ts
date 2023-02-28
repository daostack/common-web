import * as yup from "yup";
import { Currency } from "@/shared/models";
import { formatPrice } from "@/shared/utils";

export const validationSchema = yup.object({
  goalOfPayment: yup.string().required("Please enter goal of payment"),
  commonBalance: yup.number(),
  amount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .max(
      yup.ref("commonBalance"),
      ({ max }) =>
        `The amount requested cannot be greater than the Common balance (${formatPrice(
          { amount: max * 100, currency: Currency.ILS },
          { shouldRemovePrefixFromZero: false },
        )}).`,
    ),
  recipient: yup.object().shape({label: yup.string(), value: yup.string()}).required("Please select a recipient"),
  currency: yup.object().shape({label: yup.string(), value: yup.string()}).required("Please select a currency"),
});
