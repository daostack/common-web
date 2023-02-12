import React, { useEffect } from "react";
import { useEligibleVoters } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import { VoterItem } from "../VoterItem";
import styles from "./VoterList.module.scss";

interface VoterListProps {
  proposalId: string;
}

export const VoterList: React.FC<VoterListProps> = (props) => {
  const { proposalId } = props;

  const {
    loading: areVotersLoading,
    voters,
    fetchEligibleVoters,
  } = useEligibleVoters();

  useEffect(() => {
    fetchEligibleVoters(proposalId, true);
  }, [proposalId]);

  if (areVotersLoading) {
    return <Loader />;
  }

  if (voters.length === 0) {
    return <p className={styles.noVotesText}>There are no voters</p>;
  }

  return (
    <ul className={styles.voters}>
      {voters.map((voter) => (
        <VoterItem
          key={voter.userId}
          className={styles.voterItem}
          voter={voter}
        />
      ))}
    </ul>
  );
};
