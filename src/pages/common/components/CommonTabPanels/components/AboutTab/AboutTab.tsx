import React, { FC } from "react";
import { CommonTab } from "@/pages/common/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, UnstructuredRules } from "@/shared/models";
import {
  CommonDescription,
  CommonEntranceInfo,
  CommonGovernance,
  CommonRules,
} from "./components";
import styles from "./AboutTab.module.scss";

interface AboutTabProps {
  activeTab: CommonTab;
  common: Common;
  parentCommons: Common[];
  rules: UnstructuredRules;
}

const AboutTab: FC<AboutTabProps> = (props) => {
  const { activeTab, common, parentCommons, rules } = props;
  const isTabletView = useIsTabletView();

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <CommonDescription common={common} />
      <CommonGovernance commonName={common.name} />
      {rules.length > 0 && <CommonRules rules={rules} />}
    </div>
  );

  const renderAdditionalColumn = () => {
    if (isTabletView) {
      return null;
    }

    return (
      <div className={styles.additionalColumnWrapper}>
        <CommonEntranceInfo />
      </div>
    );
  };

  return (
    <div>
      <div className={styles.columnsWrapper}>
        {renderMainColumn()}
        {renderAdditionalColumn()}
      </div>
    </div>
  );
};

export default AboutTab;
