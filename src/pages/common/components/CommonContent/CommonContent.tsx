import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageSettings } from "@/pages/common/types";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
  SupportersData,
} from "@/shared/models";
import { Container } from "@/shared/ui-kit";
import { commonActions, selectIsNewProjectCreated } from "@/store/states";
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
  parentCommon?: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommonSubCommons: Common[];
  supportersData: SupportersData | null;
  isGlobalDataFetched: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
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
    parentCommonMember,
    parentCommon,
    parentCommonSubCommons,
    supportersData,
    isJoinPending,
    setIsJoinPending,
  } = props;
  const isTabletView = useIsTabletView();
  const dispatch = useDispatch();
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
  const isNewProjectCreated = useSelector(selectIsNewProjectCreated);
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
    return () => {
      dispatch(commonActions.resetCommon());
    };
  }, []);

  return (
    <CommonDataProvider
      settings={settings}
      common={common}
      parentCommon={parentCommon}
      governance={governance}
      commonMember={commonMember}
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
        commonId={common.id}
      />
      <CommonSidenavLayoutPageContent
        headerContent={
          settings?.renderHeaderContent ? (
            settings.renderHeaderContent()
          ) : !isTabletView ? (
            <HeaderContent
              commonId={common.id}
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
                  commonId={common.id}
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
        <SuccessfulProjectCreationModal parentCommonId={parentCommonId} />
      )}
    </CommonDataProvider>
  );
};

export default CommonContent;
