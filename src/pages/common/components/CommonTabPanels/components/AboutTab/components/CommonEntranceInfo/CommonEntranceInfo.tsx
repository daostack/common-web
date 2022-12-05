import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import { CommonEntranceItem } from "./components";
import styles from "./CommonEntranceInfo.module.scss";

interface CommonEntranceInfoProps {
  limitations: MemberAdmittanceLimitations;
}

const CommonEntranceInfo: FC<CommonEntranceInfoProps> = (props) => {
  const { limitations } = props;
  const isTabletView = useIsTabletView();

  if (!limitations.minFeeOneTime && !limitations.minFeeMonthly) {
    return null;
  }

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard className={styles.container} hideCardStyles={isTabletView}>
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
    </Container>
  );
};

export default CommonEntranceInfo;
