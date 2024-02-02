import React from "react";
import { BASE_URL } from "@/shared/constants";
import { Text } from "@/shared/models";
import { getCommonPagePath } from "@/shared/utils";
import { getCommon } from "./getCommon";
import { handleCommonClick } from "./handleCommonClick";
import { renderLink } from "./renderLink";
import styles from "../ChatMessage.module.scss";

const ITEM_KEY = "item";

export const getQueryParam = (path: string, key: string): string | null => {
  const urlParams = new URLSearchParams(path);

  return urlParams.get(key);
};

export const generateInternalLink = async (text: string): Promise<Text> => {
  const commonPath = text.split("/").pop();
  if (text.startsWith(BASE_URL) && commonPath) {
    const [commonId, itemQueryParam] = commonPath.split("?");
    const itemId = getQueryParam(itemQueryParam, ITEM_KEY);
    if (commonId) {
      const common = await getCommon(commonId);
      if (common?.id && common.name) {
        return (
          <>
            {renderLink({
              to: getCommonPagePath(common?.id, {
                ...(itemId && { item: itemId }),
              }),
              name: common.name,
              onClick: () =>
                handleCommonClick(common?.id, common?.rootCommonId),
              className: styles.internalLink,
            })}{" "}
          </>
        );
      }
    }
  }

  return `${text} `;
};
