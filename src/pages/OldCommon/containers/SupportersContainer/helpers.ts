import { ParsedQuery } from "query-string";
import { Language, QueryParamKey } from "@/shared/constants";

export const getAmount = (queryParams: ParsedQuery): number => {
  const rawAmount = queryParams[QueryParamKey.SupportersFlowAmount];

  if (typeof rawAmount !== "string") {
    return 0;
  }

  const amount = Number(rawAmount);

  return !Number.isNaN(amount) ? amount : 0;
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
