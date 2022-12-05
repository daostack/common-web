import React, { FC } from "react";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { CommonCard } from "../../../../../CommonCard";
import { CommonEntranceItem } from "./components";
import styles from "./CommonEntranceInfo.module.scss";

interface CommonEntranceInfoProps {
  limitations: MemberAdmittanceLimitations;
}

const CommonEntranceInfo: FC<CommonEntranceInfoProps> = (props) => {
  const { limitations } = props;

  if (!limitations.minFeeOneTime && !limitations.minFeeMonthly) {
    return null;
  }

  return (
    <CommonCard className={styles.container}>
      <h3 className={styles.title}>Entrance</h3>
      <dl className={styles.list}>
        {limitations.minFeeOneTime !== null && (
          <CommonEntranceItem
            text="Minimal single contribution"
            amount={limitations.minFeeOneTime}
          />
        )}
        {limitations.minFeeMonthly !== null && (
          <CommonEntranceItem
            text="Minimal monthly contribution"
            amount={limitations.minFeeMonthly}
            bySubscription
          />
        )}
      </dl>
    </CommonCard>
  );
};

export default CommonEntranceInfo;
