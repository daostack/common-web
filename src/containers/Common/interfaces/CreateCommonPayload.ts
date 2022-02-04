import {
  CommonContributionType,
  CommonLink,
  CommonRule,
} from "@/shared/models";

export interface CreateCommonPayload {
  userId: string;
  name: string;
  image: string;
  byline?: string;
  description?: string;
  contributionAmount: number;
  contributionType: CommonContributionType;
  rules?: CommonRule[];
  links?: CommonLink[];
  zeroContribution?: boolean;
  searchable?: boolean;
}

export type IntermediateCreateCommonPayload = Omit<
  CreateCommonPayload,
  "userId" | "zeroContribution" | "searchable"
>;
