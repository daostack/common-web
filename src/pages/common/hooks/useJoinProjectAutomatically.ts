import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ProposalService } from "@/services";
import { ProposalsTypes, SUPPORT_EMAIL } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import {
  useGovernance,
  useGovernanceByCommonId,
} from "@/shared/hooks/useCases";
import {
  CircleAccessLevel,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import {
  getCirclesWithLowestTier,
  getCommonPagePath,
  getUserName,
} from "@/shared/utils";

interface Return {
  canJoinProjectAutomatically: boolean;
  isJoinPending: boolean;
  onJoinProjectAutomatically: () => void;
  canJoin: boolean;
}

interface Options {
  shouldRedirectToFeed: boolean;
}

const checkIfCanJoinSpace = (
  commonGovernace?: Governance,
  rootGovernance?: Governance | null,
): boolean => {
  if (!commonGovernace || !rootGovernance) return false;

  const circleWithLowestTier = getCirclesWithLowestTier(
    Object.values(commonGovernace.circles),
  );
  if (circleWithLowestTier[0].accessLevel === CircleAccessLevel.Inherit) {
    const circleWithLowestTierInRoot = getCirclesWithLowestTier(
      Object.values(rootGovernance.circles),
    );
    const hasMemberAdmittance = Boolean(
      rootGovernance.proposals[ProposalsTypes.MEMBER_ADMITTANCE],
    );
    if (
      hasMemberAdmittance &&
      circleWithLowestTierInRoot[0].id === circleWithLowestTier[0].id
    ) {
      return true;
    }
  }
  return false;
};

export const useJoinProjectAutomatically = (
  commonMember: CommonMember | null,
  common?: Common,
  parentCommon?: Common,
  commonGovernace?: Governance,
  options?: Options,
): Return => {
  const history = useHistory();
  const { notify } = useNotification();
  const user = useSelector(selectUser());
  const [isJoinPending, setIsJoinPending] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [
    shouldRedirectToFeedOnCommonMemberExistence,
    setShouldRedirectToFeedOnCommonMemberExistence,
  ] = useState(false);
  const { data: parentGovernance, fetchGovernance } = useGovernance();
  const { data: rootGovernance, fetchGovernance: fetchRootGovernance } =
    useGovernanceByCommonId();

  useEffect(() => {
    if (common?.rootCommonId) {
      fetchRootGovernance(common.rootCommonId);
    }
  }, [common?.rootCommonId]);

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
    const hasMemberAdmittance = Boolean(
      commonGovernace?.proposals[ProposalsTypes.MEMBER_ADMITTANCE],
    );
    if (hasMemberAdmittance) {
      setCanJoin(true);
    } else {
      setCanJoin(checkIfCanJoinSpace(commonGovernace, rootGovernance));
    }
  }, [commonGovernace, rootGovernance]);

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

    const proposalId = uuidv4();
    const discussionId = uuidv4();
    try {
      await ProposalService.createAssignProposal({
        args: {
          id: proposalId,
          discussionId,
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
    canJoin,
  };
};
