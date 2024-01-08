import { useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useGovernanceByCommonId } from "@/shared/hooks/useCases";

interface Return {
  projectUnreadStreamsCount?: number;
  projectUnreadMessages?: number;
}

export const useFeedItemCounters = (
  feedItemId: string,
  commonId?: string,
): Return => {
  const { data: governance, fetchGovernance } = useGovernanceByCommonId();
  const { data: commonMember, missingCirclesError } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    governanceCircles: governance?.circles,
    commonId,
  });
  const { streamsUnreadCountByProjectStream, unreadCountByProjectStream } =
    commonMember || {};

  useEffect(() => {
    if (commonId) {
      fetchGovernance(commonId);
    }
  }, [fetchGovernance, commonId]);

  useEffect(() => {
    if (missingCirclesError && commonId) {
      fetchGovernance(commonId, true);
    }
  }, [missingCirclesError]);

  return {
    projectUnreadStreamsCount: streamsUnreadCountByProjectStream?.[feedItemId],
    projectUnreadMessages: unreadCountByProjectStream?.[feedItemId],
  };
};
