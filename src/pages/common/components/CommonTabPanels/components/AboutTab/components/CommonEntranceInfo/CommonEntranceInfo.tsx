import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, PaymentAmount } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import { CommonEntranceItem, CommonEntranceJoin } from "./components";
import styles from "./CommonEntranceInfo.module.scss";

interface CommonEntranceInfoProps {
  limitations?: MemberAdmittanceLimitations;
  withJoinRequest?: boolean;
  common: Common;
}

const CommonEntranceInfo: FC<CommonEntranceInfoProps> = (props) => {
  const { limitations, withJoinRequest = false, common } = props;
  const isProject = Boolean(common.directParent);
  const isTabletView = useIsTabletView();

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
          {Boolean(limitations?.minFeeOneTime) && (
            <CommonEntranceItem
              text="Minimal single contribution"
              amount={limitations?.minFeeOneTime as PaymentAmount}
            />
          )}
          {Boolean(limitations?.minFeeMonthly) && (
            <CommonEntranceItem
              text="Minimal monthly contribution"
              amount={limitations?.minFeeMonthly as PaymentAmount}
              bySubscription
            />
          )}
          {!limitations?.minFeeOneTime && !limitations?.minFeeMonthly && (
            <CommonEntranceItem text="No minimal contribution is required" />
          )}
        </dl>
        <CommonEntranceJoin
          withJoinRequest={withJoinRequest}
          common={common}
          isProject={isProject}
        />
      </CommonCard>
    </Container>
  );
};

export default CommonEntranceInfo;
