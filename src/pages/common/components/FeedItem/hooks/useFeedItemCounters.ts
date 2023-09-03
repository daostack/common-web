import { useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useCommonData } from "@/pages/commonFeed/hooks";
import { CommonFeed } from "@/shared/models";

interface Return {
  unreadStreamsCount?: number;
  unreadMessages?: number;
}

export const useFeedItemCounters = (item: CommonFeed): Return => {
  const { data: commonData, fetchCommonData } = useCommonData();
  const { data: commonMember } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    commonId: item.commonId,
    governanceCircles: commonData?.governance.circles,
  });
  const { streamsUnreadCountByProjectStream, unreadCountByProjectStream } =
    commonMember || {};

  useEffect(() => {
    fetchCommonData({ commonId: item.commonId });
  }, [fetchCommonData, item.commonId]);

  return {
    unreadStreamsCount: streamsUnreadCountByProjectStream?.[item.id],
    unreadMessages: unreadCountByProjectStream?.[item.id],
  };
};
