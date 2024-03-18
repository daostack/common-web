import { Common } from "@/shared/models";

export const compareCommonsByLastActivity = (
  prevCommon: Pick<Common, "lastActivity">,
  nextCommon: Common,
): number => {
  if (!nextCommon.lastActivity) {
    return -1;
  }
  if (!prevCommon.lastActivity) {
    return 1;
  }

  return nextCommon.lastActivity.seconds - prevCommon.lastActivity.seconds;
};
