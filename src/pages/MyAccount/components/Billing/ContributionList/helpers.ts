export const getContributionListItemId = (
  contributionId: string,
  prefix = "contribution-list-item",
): string => `${prefix}-${contributionId}`;
