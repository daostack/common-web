import * as Yup from "yup";
import {
  MIN_CONTRIBUTION_ILS_AMOUNT,
  MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION,
  ContributionType,
} from "@/shared/constants";
import { Currency } from "@/shared/models";
import { formatPrice } from "@/shared/utils";

const REQUIRED_MINIMUM_CONTRIBUTION_ERROR = `The amount must be at least ${formatPrice(
  { amount: MIN_CONTRIBUTION_ILS_AMOUNT, currency: Currency.ILS },
)} and at most ${formatPrice({
  amount: MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION,
  currency: Currency.ILS,
})}.`;

const schema = Yup.object().shape({
  contributionType: Yup.string()
    .oneOf(
      Object.values(ContributionType),
      "Please select correct contribution type",
    )
    .required("Please select a contribution type"),
  isCommonJoinFree: Yup.boolean(),
  minimumContribution: Yup.number()
    .max(
      MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION / 100,
      REQUIRED_MINIMUM_CONTRIBUTION_ERROR,
    )
    .when("isCommonJoinFree", {
      is: true,
      then: (schema) => schema.min(0),
      otherwise: (schema) =>
        schema.min(
          MIN_CONTRIBUTION_ILS_AMOUNT / 100,
          REQUIRED_MINIMUM_CONTRIBUTION_ERROR,
        ),
    })
    .required(REQUIRED_MINIMUM_CONTRIBUTION_ERROR),
});

export default schema;
