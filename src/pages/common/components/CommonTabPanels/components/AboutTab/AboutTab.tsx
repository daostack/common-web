import React, { FC } from "react";
import { CommonTab } from "@/pages/common/constants";
import { useCommonDataContext } from "@/pages/common/providers";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
  UnstructuredRules,
} from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import {
  CommonDescription,
  CommonEntranceInfo,
  CommonParent,
  CommonProjects,
  CommonRules,
} from "./components";
import { AboutActions } from "./components/AboutActions";
import { getAllowedActions } from "./utils";
import styles from "./AboutTab.module.scss";

interface AboutTabProps {
  activeTab: CommonTab;
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  subCommons: Common[];
  rules: UnstructuredRules;
  limitations?: MemberAdmittanceLimitations;
}

const AboutTab: FC<AboutTabProps> = (props) => {
  const {
    activeTab,
    common,
    governance,
    commonMember,
    subCommons,
    rules,
    limitations,
  } = props;
  const isTabletView = useIsTabletView();
  const { parentCommon, parentCommonSubCommons } = useCommonDataContext();
  const allowedAboutActions = getAllowedActions(commonMember);

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <CommonDescription common={common} />
      {rules.length > 0 && <CommonRules rules={rules} />}
    </div>
  );

  const renderAdditionalColumn = () => (
    <div className={styles.additionalColumnWrapper}>
      <CommonEntranceInfo
        limitations={limitations}
        withJoinRequest={!commonMember}
        common={common}
      />
      <CommonProjects
        commonMember={commonMember}
        subCommons={subCommons}
        circles={governance.circles}
      />
      {parentCommon && (
        <CommonParent
          parentCommon={parentCommon}
          projectsAmountInParentCommon={parentCommonSubCommons.length}
        />
      )}
    </div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <CommonDescription common={common} />
      <div className={styles.separator} />
      {subCommons.length > 0 && (
        <>
          <CommonProjects
            commonMember={commonMember}
            subCommons={subCommons}
            circles={governance.circles}
            styles={{ projectsWrapper: styles.commonProjectsWrapper }}
          />
          <div className={styles.separator} />
        </>
      )}
      <div className={styles.separator} />
      {rules.length > 0 && <CommonRules rules={rules} />}
      <div className={styles.separator} />
      <CommonEntranceInfo
        limitations={limitations}
        withJoinRequest={!commonMember}
        common={common}
      />
      {parentCommon && (
        <CommonParent
          parentCommon={parentCommon}
          projectsAmountInParentCommon={parentCommonSubCommons.length}
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <Container
        className={styles.tabNavigationContainer}
        viewports={[
          ViewportBreakpointVariant.Tablet,
          ViewportBreakpointVariant.PhoneOriented,
          ViewportBreakpointVariant.Phone,
        ]}
      >
        <TabNavigation
          activeTab={activeTab}
          rightContent={
            <AboutActions
              allowedActions={allowedAboutActions}
              common={common}
            />
          }
        />
      </Container>
      <div className={styles.columnsWrapper}>
        {!isTabletView ? (
          <>
            {renderMainColumn()}
            {renderAdditionalColumn()}
          </>
        ) : (
          renderMobileColumn()
        )}
      </div>
    </div>
  );
};

export default AboutTab;
