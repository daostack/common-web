import React, { FC, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIsTabletView } from "@/shared/hooks/viewport";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { Container, Loader, LoaderVariant } from "@/shared/ui-kit";
import { commonActions, selectIsNewProjectCreated } from "@/store/states";
import { CommonDataProvider } from "../../providers";
import { CommonHeader } from "../CommonHeader";
import { CommonManagement } from "../CommonManagement";
import { CommonTabPanels } from "../CommonTabPanels";
import { CommonTabs } from "../CommonTabs";
import { CommonTopNavigation } from "../CommonTopNavigation";
import { SuccessfulProjectCreationModal } from "./components";
import { getAllowedTabs, getMainCommonDetails } from "./utils";
import { getInitialTab } from "./utils";
import styles from "./CommonContent.module.scss";

interface CommonContentProps {
  defaultTab: string;
  common: Common;
  parentCommon?: Common;
  governance: Governance;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommonSubCommons: Common[];
  isGlobalDataFetched: boolean;
  commonMember: (CommonMember & CirclesPermissions) | null;
  parentCommonMember: CommonMember | null;
  isJoinPending: boolean;
  setIsJoinPending: (isJoinPending: boolean) => void;
}

const CommonContent: FC<CommonContentProps> = (props) => {
  const {
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
        isMobileView: isTabletView,
      }),
    [isCommonMember, isTabletView],
  );
  const [tab, setTab] = useState(() =>
    getInitialTab({
      defaultTab,
      isCommonMember,
      allowedTabs,
    }),
  );
  const isNewProjectCreated = useSelector(selectIsNewProjectCreated);
  const isSubCommon = common.directParent !== null;

  useEffect(() => {
    setTab(
      getInitialTab({
        defaultTab,
        activeTab: tab,
        isCommonMember,
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
      common={common}
      parentCommon={parentCommon}
      governance={governance}
      commonMember={commonMember}
      parentCommonMember={parentCommonMember}
      isGlobalDataFetched={isGlobalDataFetched}
      parentCommons={parentCommons}
      subCommons={subCommons}
      parentCommonSubCommons={parentCommonSubCommons}
      isJoinPending={isJoinPending}
      setIsJoinPending={setIsJoinPending}
    >
      <CommonTopNavigation
        commonMember={commonMember}
        circles={governance.circles}
        isSubCommon={isSubCommon}
        commonId={common.id}
      />
      {!isGlobalDataFetched && (
        <Loader
          overlayClassName={styles.globalLoader}
          variant={LoaderVariant.Global}
        />
      )}
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
      {isGlobalDataFetched && isNewProjectCreated && (
        <SuccessfulProjectCreationModal />
      )}
    </CommonDataProvider>
  );
};

export default CommonContent;
