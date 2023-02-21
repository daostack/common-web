import React, { FC } from "react";
import { CommonTab } from "@/pages/common/constants";
import { Common } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { TabNavigation } from "../TabNavigation";
import { Members } from "./components";
import styles from "./MembersTab.module.scss";

interface MembersTabProps {
  activeTab: CommonTab;
  common: Common;
}

export const MembersTab: FC<MembersTabProps> = (props) => {
  const { activeTab, common } = props;

  return (
    <div className={styles.container}>
      <Container className={styles.tabNavigationContainer}>
        <TabNavigation activeTab={activeTab} />
        <Members common={common} />
      </Container>
    </div>
  );
};
