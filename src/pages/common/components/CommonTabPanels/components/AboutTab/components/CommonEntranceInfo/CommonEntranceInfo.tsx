import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { Container } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
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
  const isProject = checkIsProject(common);
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
          {!!limitations?.minFeeOneTime && (
            <CommonEntranceItem
              text="Minimal single contribution"
              amount={limitations?.minFeeOneTime}
            />
          )}
          {!!limitations?.minFeeMonthly && (
            <CommonEntranceItem
              text="Minimal monthly contribution"
              amount={limitations?.minFeeMonthly}
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
