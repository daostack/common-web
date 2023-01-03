import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authentificated } from "@/pages/Auth/store/selectors";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container, Loader, LoaderVariant } from "@/shared/ui-kit";
import { CommonTab } from "../../constants";
import { CommonDataProvider } from "../../providers";
import { CommonHeader } from "../CommonHeader";
import { CommonManagement } from "../CommonManagement";
import { CommonTabPanels } from "../CommonTabPanels";
import { CommonTabs } from "../CommonTabs";
import { CommonTopNavigation } from "../CommonTopNavigation";
import { getMainCommonDetails } from "./utils";
import styles from "./CommonContent.module.scss";

interface CommonContentProps {
  common: Common;
  parentCommon?: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommonSubCommons: Common[];
  isCommonMemberFetched: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const CommonContent: FC<CommonContentProps> = (props) => {
  const {
    common,
    governance,
    parentCommons,
    subCommons,
    isCommonMemberFetched,
    commonMember,
    parentCommon,
    parentCommonSubCommons,
  } = props;
  const [tab, setTab] = useState(CommonTab.About);
  const isAuthenticated = useSelector(authentificated());
  const isTabletView = useIsTabletView();
  const isSubCommon = common.directParent !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      setTab(CommonTab.About);
    }
  }, [isAuthenticated]);

  return (
    <CommonDataProvider
      common={common}
      parentCommon={parentCommon}
      governance={governance}
      commonMember={commonMember}
      parentCommons={parentCommons}
      subCommons={subCommons}
      parentCommonSubCommons={parentCommonSubCommons}
    >
      <CommonTopNavigation
        commonMember={commonMember}
        circles={governance.circles}
        isSubCommon={isSubCommon}
        commonId={common.id}
      />
      {!isCommonMemberFetched && <Loader variant={LoaderVariant.Global} />}
      <div className={styles.container}>
        <div className={styles.contentHeaderWrapper}>
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
                commonId={common.id}
                activeTab={tab}
                isSubCommon={isSubCommon}
                circles={governance.circles}
                commonMember={commonMember}
                isAuthenticated={isAuthenticated}
                onTabChange={setTab}
              />
            </Container>
          )}
        </div>
        <CommonTabPanels
          activeTab={tab}
          common={common}
          governance={governance}
          commonMember={commonMember}
          subCommons={subCommons}
        />
        {isTabletView && (
          <CommonTabs
            className={styles.tabs}
            activeTab={tab}
            isAuthenticated={isAuthenticated}
            onTabChange={setTab}
          />
        )}
      </div>
    </CommonDataProvider>
  );
};

export default CommonContent;
