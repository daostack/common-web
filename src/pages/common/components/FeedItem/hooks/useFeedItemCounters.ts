import { useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useCommonData } from "@/pages/commonFeed/hooks";

interface Return {
  unreadStreamsCount?: number;
  unreadMessages?: number;
}

export const useFeedItemCounters = (
  feedItemId: string,
  commonId?: string,
): Return => {
  const { data: commonData, fetchCommonData } = useCommonData();
  const { data: commonMember } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    governanceCircles: commonData?.governance.circles,
    commonId,
  });
  const { streamsUnreadCountByProjectStream, unreadCountByProjectStream } =
    commonMember || {};

  useEffect(() => {
    if (commonId) {
      fetchCommonData({ commonId });
    }
  }, [fetchCommonData, commonId]);

  return {
    unreadStreamsCount: streamsUnreadCountByProjectStream?.[feedItemId],
    unreadMessages: unreadCountByProjectStream?.[feedItemId],
  };
};
