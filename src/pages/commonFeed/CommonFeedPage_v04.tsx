import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import { checkIsProject } from "@/shared/utils";
import BaseCommonFeedPage from "./BaseCommonFeedPage";
import { RenderCommonFeedContentWrapper } from "./CommonFeed";
import HeaderContent_v04 from "./components/HeaderContent_v04/HeaderContent_v04";
import styles from "./CommonFeedPage_v04.module.scss";

const renderContentWrapper: RenderCommonFeedContentWrapper = ({
  children,
  wrapperStyles,
  commonData,
  commonMember,
  isGlobalDataFetched,
}) => (
  <CommonSidenavLayoutPageContent
    className={styles.layoutPageContent}
    headerClassName={styles.layoutHeader}
    headerContent={
      <HeaderContent_v04
        commonId={commonData.common.id}
        commonName={commonData.common.name}
        commonImage={commonData.common.image}
        commonMembersAmount={commonData.common.memberCount}
        commonMember={commonMember}
        governance={commonData.governance}
        isProject={checkIsProject(commonData.common)}
      />
    }
    isGlobalLoading={!isGlobalDataFetched}
    styles={wrapperStyles}
  >
    {children}
  </CommonSidenavLayoutPageContent>
);

const CommonFeedPage: FC = () => (
  <RoutesV04Provider>
    <BaseCommonFeedPage renderContentWrapper={renderContentWrapper} />
  </RoutesV04Provider>
);

export default CommonFeedPage;
