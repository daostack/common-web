import React, { FC } from "react";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonEntranceInfo.module.scss";

const CommonEntranceInfo: FC = () => {
  return (
    <CommonCard className={styles.container}>
      <h3 className={styles.title}>Entrance</h3>
      <dl className={styles.list}>
        <div className={styles.item}>
          <dt className={styles.itemLabel}>Minimal single contribution</dt>
          <dd className={styles.itemValue}>100 ILS</dd>
        </div>
      </dl>
    </CommonCard>
  );
};

export default CommonEntranceInfo;
