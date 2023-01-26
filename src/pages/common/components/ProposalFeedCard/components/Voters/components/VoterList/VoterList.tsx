import React, { useEffect } from "react";
import { useVotesWithUserInfo } from "@/pages/OldCommon/hooks";
import { Loader } from "@/shared/ui-kit";
import { VoterItem } from "../VoterItem";
import styles from "./VoterList.module.scss";

interface VoterListProps {
  proposalId: string;
}

export const VoterList: React.FC<VoterListProps> = (props) => {
  const { proposalId } = props;
  const {
    loading: areVotesLoading,
    votes,
    fetchVotes,
  } = useVotesWithUserInfo();

  useEffect(() => {
    fetchVotes(proposalId, true);
  }, [proposalId]);

  if (areVotesLoading) {
    return <Loader />;
  }

  if (votes.length === 0) {
    return <p className={styles.noVotesText}>There are no votes</p>;
  }

  return (
    <ul className={styles.voters}>
      {votes.map((vote) => (
        <VoterItem key={vote.id} className={styles.voterItem} vote={vote} />
      ))}
    </ul>
  );
};
