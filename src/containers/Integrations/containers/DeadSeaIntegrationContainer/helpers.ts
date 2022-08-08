import { ParsedQuery } from "query-string";
import { QueryParamKey } from "@/shared/constants";

export const getAmount = (queryParams: ParsedQuery): number => {
  const rawAmount = queryParams[QueryParamKey.DeadSeaIntegrationAmount];

  if (typeof rawAmount !== "string") {
    return 0;
  }

  const amount = Number(rawAmount);

  return !Number.isNaN(amount) ? amount : 0;
};
