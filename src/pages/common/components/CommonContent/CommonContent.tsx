import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CommonPageSettings } from "@/pages/common/types";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { SpaceListVisibility } from "@/shared/interfaces";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
  SupportersData,
} from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { getInboxPagePath } from "@/shared/utils";
import { selectIsNewProjectCreated } from "@/store/states";
import { CommonDataProvider } from "../../providers";
import { CommonHeader } from "../CommonHeader";
import { CommonManagement } from "../CommonManagement";
import { CommonTabPanels } from "../CommonTabPanels";
import { CommonTabs } from "../CommonTabs";
import { CommonTopNavigation } from "../CommonTopNavigation";
import { HeaderContent, SuccessfulProjectCreationModal } from "./components";
import { getAllowedTabs, getMainCommonDetails } from "./utils";
import { getInitialTab } from "./utils";
import styles from "./CommonContent.module.scss";

interface CommonContentProps {
  settings: CommonPageSettings;
  defaultTab: string;
  common: Common;
  rootCommon: Common | null;
  parentCommon?: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommonSubCommons: Common[];
  supportersData: SupportersData | null;
  isGlobalDataFetched: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
  rootCommonMember: CommonMember | null;
  parentCommonMember: CommonMember | null;
  isJoinPending: boolean;
  setIsJoinPending: (isJoinPending: boolean) => void;
}

const CommonContent: FC<CommonContentProps> = (props) => {
  const {
    settings,
    defaultTab,
    common,
    governance,
    parentCommons,
    subCommons,
    isGlobalDataFetched,
    commonMember,
    rootCommon,
    rootCommonMember,
    parentCommonMember,
    parentCommon,
    parentCommonSubCommons,
    supportersData,
    isJoinPending,
    setIsJoinPending,
  } = props;
  const isTabletView = useIsTabletView();
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const { getCommonPagePath } = useRoutesContext();
  const isCommonMember = Boolean(commonMember);
  const allowedTabs = useMemo(
    () =>
      getAllowedTabs({
        isCommonMember,
        withFeed: settings.withFeedTab,
      }),
    [isCommonMember, settings.withFeedTab],
  );
  const [tab, setTab] = useState(() =>
    getInitialTab({
      defaultTab,
      allowedTabs,
    }),
  );

  const commonId = common.id;
  const isNewProjectCreated = useSelector(selectIsNewProjectCreated(commonId));
  const parentCommonId = common.directParent?.commonId;
  const isSubCommon = common.directParent !== null;

  useEffect(() => {
    setTab(
      getInitialTab({
        defaultTab,
        allowedTabs,
      }),
    );
  }, [allowedTabs]);

  useEffect(() => {
    if (
      !isCommonMember &&
      common.listVisibility === SpaceListVisibility.Members
    ) {
      canGoBack ? goBack() : history.push(getInboxPagePath());
    }
  }, [isCommonMember, common.listVisibility, history.push, goBack, canGoBack]);

  return (
    <CommonDataProvider
      settings={settings}
      common={common}
      rootCommon={rootCommon}
      parentCommon={parentCommon}
      governance={governance}
      commonMember={commonMember}
      rootCommonMember={rootCommonMember}
      parentCommonMember={parentCommonMember}
      isGlobalDataFetched={isGlobalDataFetched}
      parentCommons={parentCommons}
      subCommons={subCommons}
      parentCommonSubCommons={parentCommonSubCommons}
      supportersData={supportersData}
      isJoinPending={isJoinPending}
      setIsJoinPending={setIsJoinPending}
    >
      <CommonTopNavigation
        commonMember={commonMember}
        circles={governance.circles}
        isSubCommon={isSubCommon}
        commonId={commonId}
      />
      <CommonSidenavLayoutPageContent
        className={settings?.pageContentClassName}
        headerContent={
          settings?.renderHeaderContent ? (
            settings.renderHeaderContent()
          ) : !isTabletView ? (
            <HeaderContent
              backButtonPath={getCommonPagePath(commonId)}
              withoutBackButton={!commonMember}
            />
          ) : null
        }
        isGlobalLoading={!isGlobalDataFetched}
      >
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
                  commonId={commonId}
                  activeTab={tab}
                  allowedTabs={allowedTabs}
                  isSubCommon={isSubCommon}
                  circles={governance.circles}
                  commonMember={commonMember}
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
              allowedTabs={allowedTabs}
              onTabChange={setTab}
            />
          )}
        </div>
      </CommonSidenavLayoutPageContent>
      {isGlobalDataFetched && isNewProjectCreated && parentCommonId && (
        <SuccessfulProjectCreationModal
          commonId={commonId}
          parentCommonId={parentCommonId}
        />
      )}
    </CommonDataProvider>
  );
};

export default CommonContent;
