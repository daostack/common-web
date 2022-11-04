import { ParsedQuery } from "query-string";
import { ContributionType, Language, QueryParamKey } from "@/shared/constants";

export const getAmount = (queryParams: ParsedQuery): number => {
  const rawAmount = queryParams[QueryParamKey.SupportersFlowAmount];

  if (typeof rawAmount !== "string") {
    return 0;
  }

  const amount = Number(rawAmount);

  return !Number.isNaN(amount) ? amount : 0;
};

export const getContributionType = (queryParams: ParsedQuery): ContributionType => {
  const rawMonthly = queryParams[QueryParamKey.SupportersFlowMonthly];

  if (typeof rawMonthly !== "string") {
    return ContributionType.OneTime;
  }

  const isMonthly = rawMonthly === 'true';

  return isMonthly ? ContributionType.Monthly : ContributionType.OneTime;
};

export const getInitialLanguage = (
  queryParams: ParsedQuery,
): Language | null => {
  const rawLanguage = queryParams[QueryParamKey.Language];

  if (typeof rawLanguage !== "string") {
    return null;
  }

  return Object.values(Language).includes(rawLanguage as Language)
    ? (rawLanguage as Language)
    : null;
};
