import { enumType } from "nexus";

export const CommonContributionTypeEnum = enumType({
  name: 'CommonContributionType',
  members: {
    oneTime: 'one-time',
    monthly: 'monthly',
  },
});