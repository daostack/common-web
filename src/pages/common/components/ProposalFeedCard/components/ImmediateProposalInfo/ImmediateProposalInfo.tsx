import React from "react";
import { getVotersString } from "@/pages/OldCommon/containers/ProposalContainer/helpers";
import { Governance, Proposal } from "@/shared/models";
import styles from "./ImmediateProposalInfo.module.scss";

interface ImmediateProposalInfoProps {
  proposal: Proposal;
  governanceCircles: Governance["circles"];
  proposerUserName: string;
}

export const ImmediateProposalInfo = ({
  proposal,
  governanceCircles,
  proposerUserName,
}: ImmediateProposalInfoProps) => {
  const votersString = getVotersString(
    proposal.global.weights,
    governanceCircles,
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        {`${proposerUserName} requests to join ${votersString} circle`}
      </div>
      {/* Show this only when the required number of voters is greater than 1. Logic for this will be added in the future, see detalis here https://github.com/daostack/common-backend/issues/1844 */}
      {/* <div className={styles.subtitle}>
        {`Approval by ${votersString} (1 from ${proposal.votes.totalMembersWithVotingRight} required)`}
      </div> */}
    </div>
  );
};
