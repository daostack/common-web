import React, { FC, useMemo } from "react";
import { flattenDeep, uniq } from "lodash";
import { ProposalsTypes } from "@/shared/constants";
import { Circles, Governance } from "@/shared/models";
import {
  getCircleNamesWithSeparator,
  getFilteredByIdCircles,
} from "@/shared/utils";
import styles from "./VotingSettings.module.scss";

interface VotingSettingsProps {
  proposalSelectedType: ProposalsTypes;
  governanceCircles: Circles;
  governance: Governance;
}

const VotingSettings: FC<VotingSettingsProps> = ({
  governanceCircles,
  proposalSelectedType,
  governance,
}) => {
  const proposalSettings = governance.proposals[proposalSelectedType].global;

  const voters = useMemo(() => {
    if (!proposalSettings) {
      return null;
    }

    const proposalCircles = uniq(
      flattenDeep(
        proposalSettings.weights.map(({ circles }) =>
          Object.values(circles.map),
        ),
      ),
    ) as string[];

    return getCircleNamesWithSeparator(
      getFilteredByIdCircles(Object.values(governanceCircles), proposalCircles),
    );
  }, [proposalSettings, governanceCircles]);

  return (
    <div className={styles.container}>
      <label className={styles.text}>Voting settings:</label>
      <span className={styles.text}>
        {voters ? `Voters: ${voters},` : ""}Voting:{" "}
        {proposalSettings.votingDuration}h, Quorum: {proposalSettings.quorum}%,
        Min. support: {proposalSettings.minApprove}%, Max. object:{" "}
        {proposalSettings.maxReject}%
      </span>
    </div>
  );
};

export default VotingSettings;
