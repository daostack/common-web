import { DropdownOption } from "@/shared/components";
import { FundType } from "./types";

export enum FundsAllocationStep {
  Configuration,
  Funds,
  BankAccount,
  Confirmation,
  Success,
}


export const FUND_TYPES: DropdownOption[] = [
  {
    text: "ILS",
    searchText: "ILS",
    value: FundType.ILS,
  },
  {
    text: "Dollars",
    searchText: "Dollars",
    value: FundType.USD,
    className: "funds-allocation-configuration__fund-type--disabled",
  },
  {
    text: "Tokens",
    searchText: "Tokens",
    value: FundType.Token,
    className: "funds-allocation-configuration__fund-type--disabled",
  },
];