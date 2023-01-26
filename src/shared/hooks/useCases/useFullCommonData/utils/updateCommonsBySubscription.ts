import { Common } from "@/shared/models";

export const updateCommonsBySubscription = (
  subscriptionData: { common: Common; isRemoved: boolean }[],
  initialData: Common[] = [],
): Common[] =>
  subscriptionData.reduce<Common[]>((finalCommons, { common, isRemoved }) => {
    if (isRemoved) {
      return finalCommons.filter((finalCommon) => finalCommon.id !== common.id);
    }

    const isExistingCommon = finalCommons.some(
      (finalCommon) => finalCommon.id === common.id,
    );

    return isExistingCommon
      ? finalCommons.map((finalCommon) =>
          finalCommon.id === common.id ? common : finalCommon,
        )
      : finalCommons.concat(common);
  }, initialData);
