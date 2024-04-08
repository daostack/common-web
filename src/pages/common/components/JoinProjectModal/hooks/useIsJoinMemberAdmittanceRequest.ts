import { useEffect, useMemo } from "react";
import { ProposalOutcomeUnit, ProposalsTypes } from "@/shared/constants";
import { useGovernance } from "@/shared/hooks/useCases";
import { Common, Governance } from "@/shared/models";

export const useIsJoinMemberAdmittanceRequest = (
  governance: Governance,
  common: Common,
  parentCommon?: Common,
): boolean => {
  const { data: parentGovernance, fetchGovernance } = useGovernance();
  const circleId = common?.directParent?.circleId;

  useEffect(() => {
    if (parentCommon?.governanceId) {
      fetchGovernance(parentCommon.governanceId);
    }
  }, [parentCommon?.governanceId]);

  const isJoinMemberAdmittanceRequest = useMemo(() => {
    const isMemberAdmittance = Boolean(
      governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE],
    );

    if (!circleId || !parentGovernance) {
      return isMemberAdmittance;
    }

    const assignCircleProposals =
      parentGovernance.proposals[ProposalsTypes.ASSIGN_CIRCLE];
    const global =
      assignCircleProposals && assignCircleProposals[circleId]?.global;
    const { minApproveUnit } = global ?? {};

    return (
      isMemberAdmittance && minApproveUnit !== ProposalOutcomeUnit.Absolute
    );
  }, [circleId, governance.id, parentGovernance?.id]);

  return isJoinMemberAdmittanceRequest;
};
