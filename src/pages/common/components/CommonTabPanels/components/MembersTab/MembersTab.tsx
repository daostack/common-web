import React, { FC } from "react";
import { CommonTab } from "@/pages/common/constants";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { TabNavigation } from "../TabNavigation";
import { Members } from "./components";
import styles from "./MembersTab.module.scss";

interface MembersTabProps {
  activeTab: CommonTab;
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

export const MembersTab: FC<MembersTabProps> = (props) => {
  const { activeTab, common, commonMember } = props;

  return (
    <div className={styles.container}>
      <Container className={styles.tabNavigationContainer}>
        <TabNavigation activeTab={activeTab} />
        <Members
          commonId={common.id}
          governanceId={common.governanceId}
          commonMember={commonMember}
          isProject={checkIsProject(common)}
        />
      </Container>
    </div>
  );
};
