import { ProposalsTypes } from "@/shared/constants";
import { Governance } from "@/shared/models";

export const checkIsAutomaticJoin = (
  governance?: Pick<Governance, "proposals"> | null,
): boolean =>
  governance?.proposals[ProposalsTypes.MEMBER_ADMITTANCE]?.global
    .votingDuration === 0;
