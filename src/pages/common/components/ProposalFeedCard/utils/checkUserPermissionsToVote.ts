import { GovernanceActions } from "@/shared/constants";
import { CirclesPermissions, CommonMember, Proposal } from "@/shared/models";

export const checkUserPermissionsToVote = ({
  proposal,
  commonMember,
}: {
  proposal: Proposal;
  commonMember?: (CommonMember & CirclesPermissions) | null;
}): boolean =>
  Boolean(
    commonMember &&
      commonMember.allowedActions[GovernanceActions.CREATE_VOTE] &&
      proposal.global.weights.some(
        ({ circles }) => commonMember.circles.bin & circles.bin,
      ),
  );
