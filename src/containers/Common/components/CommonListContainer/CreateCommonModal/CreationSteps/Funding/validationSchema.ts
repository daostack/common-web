import * as Yup from "yup";

import { ContributionType } from "@/shared/constants/contributionType";
import { MIN_CONTRIBUTION_VALUE } from "./constants";

const REQUIRED_MINIMUM_CONTRIBUTION_ERROR = `The minimum contribution must be $${MIN_CONTRIBUTION_VALUE} or higher`;
const schema = Yup.object().shape({
  contributionType: Yup.string()
    .oneOf(Object.values(ContributionType), "Please select correct contribution type")
    .required("Please select a contribution type"),
  minimumContribution: Yup.number()
    .min(MIN_CONTRIBUTION_VALUE, REQUIRED_MINIMUM_CONTRIBUTION_ERROR)
    .when("isCommonJoinFree", {
      is: false,
      then: Yup.number().required(REQUIRED_MINIMUM_CONTRIBUTION_ERROR),
    })
    .when("contributionType", {
      is: ContributionType.Monthly,
      then: Yup.number().required(REQUIRED_MINIMUM_CONTRIBUTION_ERROR),
    }),
  isCommonJoinFree: Yup.boolean(),
});

export default schema;
