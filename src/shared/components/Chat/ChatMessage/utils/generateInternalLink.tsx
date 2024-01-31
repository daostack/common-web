import React from "react";
import { DiscussionService, ProposalService } from "@/services";
import CommonFeed from "@/services/CommonFeed";
import { BASE_URL } from "@/shared/constants";
import { CommonFeedType, Text } from "@/shared/models";
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

const getStreamNameByFeedItemId = async (
  commonId: string,
  feedItemId: string | null,
): Promise<string | undefined> => {
  const feetItem = feedItemId
    ? await CommonFeed.getCommonFeedItemById(commonId, feedItemId)
    : null;

  if (!feetItem?.data) {
    return;
  }

  if (feetItem?.data.type === CommonFeedType.Discussion) {
    const item = await DiscussionService.getDiscussionById(feetItem?.data.id);
    return item?.title;
  } else (feetItem?.data.type === CommonFeedType.Proposal) {
    const item = await ProposalService.getProposalById(feetItem?.data.id);
    return item?.discussion?.title;
  }
};

export const generateInternalLink = async (text: string): Promise<Text> => {
  const commonPath = text.split("/").pop();
  if (text.startsWith(BASE_URL) && commonPath) {
    const [commonId, itemQueryParam] = commonPath.split("?");
    const itemId = getQueryParam(itemQueryParam, ITEM_KEY);
    if (commonId) {
      const common = await getCommon(commonId);
      if (common?.id && common.name) {
        const itemTitle = await getStreamNameByFeedItemId(commonId, itemId);

        return (
          <>
            {renderLink({
              to: getCommonPagePath(common?.id, {
                ...(itemId && { item: itemId }),
              }),
              name: itemTitle ?? common.name,
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
