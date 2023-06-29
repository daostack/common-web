import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import BaseCommonFeedPage from "./BaseCommonFeedPage";
import { RenderCommonFeedContentWrapper } from "./CommonFeed";
import styles from "./CommonFeedPage.module.scss";

const renderContentWrapper: RenderCommonFeedContentWrapper = ({
  children,
  wrapperStyles,
  commonData,
  commonMember,
  isGlobalDataFetched,
}) => (
  <MultipleSpacesLayoutPageContent headerContent={<div>Header</div>}>
    {children}
  </MultipleSpacesLayoutPageContent>
);
const CommonFeedPage: FC = () => (
  <MainRoutesProvider>
    <BaseCommonFeedPage renderContentWrapper={renderContentWrapper} />
  </MainRoutesProvider>
);

export default CommonFeedPage;
