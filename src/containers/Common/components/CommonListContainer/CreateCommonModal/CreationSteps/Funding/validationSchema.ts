import * as Yup from "yup";
import { MIN_CONTRIBUTION_ILS_AMOUNT } from "@/shared/constants";
import { CommonContributionType } from "@/shared/models";
import { formatPrice } from "@/shared/utils";

const REQUIRED_MINIMUM_CONTRIBUTION_ERROR = `The minimum contribution must be ${formatPrice(MIN_CONTRIBUTION_ILS_AMOUNT)} or higher`;
const schema = Yup.object().shape({
  contributionType: Yup.string()
    .oneOf(Object.values(CommonContributionType), "Please select correct contribution type")
    .required("Please select a contribution type"),
  minimumContribution: Yup.number()
    .min(MIN_CONTRIBUTION_ILS_AMOUNT, REQUIRED_MINIMUM_CONTRIBUTION_ERROR)
    .when("isCommonJoinFree", {
      is: false,
      then: Yup.number().required(REQUIRED_MINIMUM_CONTRIBUTION_ERROR),
    })
    .when("contributionType", {
      is: CommonContributionType.Monthly,
      then: Yup.number().required(REQUIRED_MINIMUM_CONTRIBUTION_ERROR),
    }),
  isCommonJoinFree: Yup.boolean(),
});

export default schema;
