import { CurrencySymbol } from "@/shared/models";
import { FundType } from "./types";

export const getPrefix = (fundType: FundType): string => {
  switch (fundType) {
    case FundType.ILS:
      return CurrencySymbol.Shekel;
    case FundType.USD:
      return CurrencySymbol.USD;
    default:
      // TODO icon for tokens
      return "&";
  }
};
