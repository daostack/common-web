import { truncate } from "lodash-es";

const OMISSION = "...";
const MOBILE_MAXIMUM_ITEM_LENGTH = 10 + OMISSION.length;

export const truncateBreadcrumbName = (itemName: string) => {
  return truncate(itemName, {
    length: MOBILE_MAXIMUM_ITEM_LENGTH,
    omission: OMISSION,
  });
};
