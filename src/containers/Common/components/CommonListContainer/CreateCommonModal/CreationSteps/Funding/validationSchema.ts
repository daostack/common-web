import * as Yup from "yup";
import {
  MIN_CONTRIBUTION_ILS_AMOUNT,
  MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION,
  ContributionType,
} from "@/shared/constants";
import { formatPrice } from "@/shared/utils";

const REQUIRED_MINIMUM_CONTRIBUTION_ERROR = `The amount must be at least ${formatPrice(
  MIN_CONTRIBUTION_ILS_AMOUNT
)} and at most ${formatPrice(MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION)}.`;

console.log('-Object.values(ContributionType)',Object.values(ContributionType));
const schema = Yup.object().shape({
  contributionType: Yup.string()
    .oneOf(
      Object.values(ContributionType),
      "Please select correct contribution type"
    )
    .required("Please select a contribution type"),
  minimumContribution: Yup.number()
    .min(MIN_CONTRIBUTION_ILS_AMOUNT / 100, REQUIRED_MINIMUM_CONTRIBUTION_ERROR)
    .max(
      MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION / 100,
      REQUIRED_MINIMUM_CONTRIBUTION_ERROR
    )
    .required(REQUIRED_MINIMUM_CONTRIBUTION_ERROR),
  isCommonJoinFree: Yup.boolean(),
});

export default schema;