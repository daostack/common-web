import { Common } from "@/shared/models";
import { formatPrice } from "@/shared/utils";
import { KeyValueItem } from "../../CommonHeader";

export const getMainCommonDetails = (common: Common): KeyValueItem[] => [
  {
    id: "available-funds",
    name: "Available Funds",
    value: formatPrice(common.balance),
    valueHint: formatPrice(common.balance, { shouldMillify: false }),
  },
  {
    id: "members",
    name: "Members",
    value: String(common.memberCount),
  },
];
