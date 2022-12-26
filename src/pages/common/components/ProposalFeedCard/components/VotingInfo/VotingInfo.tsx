import React from "react";
import styles from "./VotingInfo.module.scss";

interface VotingInfoProps {
  label: string;
}

export const VotingInfo: React.FC<VotingInfoProps> = ({ children, label }) => {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
      <div className={styles.valueContainer}>{children}</div>
    </div>
  );
};
