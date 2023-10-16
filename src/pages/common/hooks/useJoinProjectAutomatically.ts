import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ProposalService } from "@/services";
import { ProposalsTypes, SUPPORT_EMAIL } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { useGovernance } from "@/shared/hooks/useCases";
import { Common, CommonMember } from "@/shared/models";
import { getCommonPagePath, getUserName } from "@/shared/utils";

interface Return {
  canJoinProjectAutomatically: boolean;
  isJoinPending: boolean;
  onJoinProjectAutomatically: () => void;
}

interface Options {
  shouldRedirectToFeed: boolean;
}

export const useJoinProjectAutomatically = (
  commonMember: CommonMember | null,
  common?: Common,
  parentCommon?: Common,
  options?: Options,
): Return => {
  const history = useHistory();
  const { notify } = useNotification();
  const user = useSelector(selectUser());
  const [isJoinPending, setIsJoinPending] = useState(false);
  const [
    shouldRedirectToFeedOnCommonMemberExistence,
    setShouldRedirectToFeedOnCommonMemberExistence,
  ] = useState(false);
  const { data: parentGovernance, fetchGovernance } = useGovernance();
  const circleId = common?.directParent?.circleId;

  const canJoinProjectAutomatically = useMemo(() => {
    if (!circleId || !parentGovernance) {
      return false;
    }

    const assignCircleProposals =
      parentGovernance.proposals[ProposalsTypes.ASSIGN_CIRCLE];
    const global =
      assignCircleProposals && assignCircleProposals[circleId]?.global;
    const { votingDuration, minApprove, quorum } = global ?? {};

    return votingDuration === 0 && minApprove === 0 && quorum === 0;
  }, [parentGovernance?.id, circleId]);

  useEffect(() => {
    if (parentCommon?.governanceId) {
      fetchGovernance(parentCommon.governanceId);
    }
  }, [parentCommon?.governanceId]);

  useEffect(() => {
    if (shouldRedirectToFeedOnCommonMemberExistence && common && commonMember) {
      setIsJoinPending(false);
      history.push(getCommonPagePath(common.id));
    }
  }, [common?.id, shouldRedirectToFeedOnCommonMemberExistence, commonMember]);

  const onJoinProjectAutomatically = useCallback(async () => {
    if (!user || !parentCommon || !parentGovernance || !circleId) {
      return;
    }

    const circleName = Object.values(parentGovernance.circles).find(
      ({ id }) => id === circleId,
    )?.name;

    setIsJoinPending(true);

    try {
      await ProposalService.createAssignProposal({
        args: {
          commonId: parentCommon.id,
          userId: user?.uid,
          circleId,
          title: `Request to join ${circleName} circle by ${getUserName(user)}`,
          description: "Joining space",
          images: [],
          files: [],
          links: [],
        },
      });

      if (options?.shouldRedirectToFeed) {
        setShouldRedirectToFeedOnCommonMemberExistence(true);
      }
    } catch (err) {
      setIsJoinPending(false);
      notify(
        `Something went wrong. Please try again later or contact us at: ${SUPPORT_EMAIL}`,
      );
    }
  }, [user?.uid, parentCommon?.id, parentGovernance?.id, circleId]);

  return {
    isJoinPending,
    canJoinProjectAutomatically,
    onJoinProjectAutomatically,
  };
};
