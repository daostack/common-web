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
    error,
  } = useEligibleVoters();

  useEffect(() => {
    fetchEligibleVoters(proposalId, true);
  }, [proposalId]);

  if (areVotersLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <p className={styles.noVotesText}>
        An error occurred while loading the voters
      </p>
    );
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
