import * as Yup from "yup";
import {
  MIN_CONTRIBUTION_ILS_AMOUNT,
  MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION,
} from "@/shared/constants";
import { CommonContributionType } from "@/shared/models";
import { formatPrice } from "@/shared/utils";

const REQUIRED_MINIMUM_CONTRIBUTION_ERROR = `The amount must be at least ${formatPrice(
  MIN_CONTRIBUTION_ILS_AMOUNT
)} and at most ${formatPrice(MAX_CONTRIBUTION_ILS_AMOUNT_IN_COMMON_CREATION)}.`;

const schema = Yup.object().shape({
  contributionType: Yup.string()
    .oneOf(
      Object.values(CommonContributionType),
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
