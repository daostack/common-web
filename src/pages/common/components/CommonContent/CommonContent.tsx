import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authentificated } from "@/pages/Auth/store/selectors";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common, CommonMember, Governance } from "@/shared/models";
import { Container, Loader, LoaderVariant } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { CommonHeader } from "../CommonHeader";
import { CommonManagement } from "../CommonManagement";
import { CommonTabPanels } from "../CommonTabPanels";
import { CommonTopNavigation } from "../CommonTopNavigation";
import { getMainCommonDetails } from "./utils";
import styles from "./CommonContent.module.scss";

interface CommonContentProps {
  common: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  isCommonMemberFetched: boolean;
  commonMember: CommonMember | null;
}

const CommonContent: FC<CommonContentProps> = (props) => {
  const {
    common,
    governance,
    parentCommons,
    subCommons,
    isCommonMemberFetched,
    commonMember,
  } = props;
  const [tab, setTab] = useState(CommonTab.About);
  const isAuthenticated = useSelector(authentificated());
  const isTabletView = useIsTabletView();

  useEffect(() => {
    if (!isAuthenticated) {
      setTab(CommonTab.About);
    }
  }, [isAuthenticated]);

  return (
    <>
      <CommonTopNavigation />
      {!isCommonMemberFetched && <Loader variant={LoaderVariant.Global} />}
      <div className={styles.container}>
        <Container>
          <CommonHeader
            commonImageSrc={common.image}
            commonName={common.name}
            description={common.byline}
            details={getMainCommonDetails(common)}
            isProject={Boolean(common.directParent)}
            withJoin={false}
          />
        </Container>
        <div className={styles.commonHeaderSeparator} />
        {!isTabletView && (
          <Container>
            <CommonManagement
              activeTab={tab}
              circles={governance.circles}
              circlesMap={commonMember?.circles.map}
              isAuthenticated={isAuthenticated}
              onTabChange={setTab}
            />
          </Container>
        )}
        <CommonTabPanels
          activeTab={tab}
          common={common}
          governance={governance}
          parentCommons={parentCommons}
          subCommons={subCommons}
        />
      </div>
    </>
  );
};

export default CommonContent;
