import React, { FC } from "react";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonGovernance.module.scss";

interface CommonGovernanceProps {
  commonName: string;
}

const CommonGovernance: FC<CommonGovernanceProps> = (props) => {
  const { commonName } = props;

  return (
    <CommonCard>
      <h3 className={styles.title}>Governance</h3>
      <p className={styles.description}>
        The various permissions for each circle in <strong>{commonName}</strong>
        , in terms of proposing and voting on various actions
      </p>
    </CommonCard>
  );
};

export default CommonGovernance;
