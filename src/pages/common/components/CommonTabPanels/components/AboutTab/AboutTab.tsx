import React, { FC } from "react";
import classNames from "classnames";
import { CommonTab } from "@/pages/common/constants";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, UnstructuredRules } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import {
  CommonDescription,
  CommonEntranceInfo,
  CommonGovernance,
  CommonProjects,
  CommonRules,
} from "./components";
import styles from "./AboutTab.module.scss";

interface AboutTabProps {
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
  subCommons: Common[];
  rules: UnstructuredRules;
  limitations?: MemberAdmittanceLimitations;
}

const AboutTab: FC<AboutTabProps> = (props) => {
  const { activeTab, common, parentCommons, subCommons, rules, limitations } =
    props;
  const isTabletView = useIsTabletView();

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <CommonDescription common={common} />
      <CommonGovernance commonName={common.name} />
      {rules.length > 0 && <CommonRules rules={rules} />}
    </div>
  );

  const renderAdditionalColumn = () => (
    <div className={styles.additionalColumnWrapper}>
      {limitations && <CommonEntranceInfo limitations={limitations} />}
      <CommonProjects subCommons={subCommons} />
    </div>
  );

  const renderMobileColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <CommonDescription common={common} />
      <div className={styles.separator} />
      <CommonGovernance commonName={common.name} />
      <div className={styles.separator} />
      {rules.length > 0 && <CommonRules rules={rules} />}
      <div className={styles.separator} />
      {limitations && <CommonEntranceInfo limitations={limitations} />}
    </div>
  );

  return (
    <div className={styles.container}>
      <Container
        className={classNames(
          styles.tabNavigationContainer,
          styles.tabNavigationContainerWithoutActions,
        )}
        viewports={[
          ViewportBreakpointVariant.Tablet,
          ViewportBreakpointVariant.PhoneOriented,
          ViewportBreakpointVariant.Phone,
        ]}
      >
        <TabNavigation
          activeTab={activeTab}
          common={common}
          parentCommons={parentCommons}
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
