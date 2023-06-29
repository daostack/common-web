import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import { CommonSidenavLayoutPageContent } from "@/shared/layouts";
import { checkIsProject } from "@/shared/utils";
import BaseCommonFeedPage from "./BaseCommonFeedPage";
import { RenderCommonFeedContentWrapper } from "./CommonFeed";
import { HeaderContent } from "./components";
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
      <HeaderContent
        commonId={commonData.common.id}
        commonName={commonData.common.name}
        commonImage={commonData.common.image}
        commonMembersAmount={commonData.commonMembersAmount}
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
