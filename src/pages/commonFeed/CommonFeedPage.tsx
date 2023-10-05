import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { InboxItemType } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import {
  multipleSpacesLayoutActions,
  selectCommonLayoutLastCommonFromFeed,
  selectMultipleSpacesLayoutMainWidth,
} from "@/store/states";
import BaseCommonFeedPage, {
  CommonFeedPageRouterParams,
} from "./BaseCommonFeedPage";
import { RenderCommonFeedContentWrapper } from "./CommonFeed";
import {
  FeedLayoutOuterStyles,
  FeedLayoutSettings,
  HeaderContent,
  HeaderCommonContent,
  HeaderContentWrapper,
} from "./components";
import { useActiveItemDataChange } from "./hooks";
import { generateSplitViewMaxSizeGetter } from "./utils";
import styles from "./CommonFeedPage.module.scss";

export const FEED_LAYOUT_OUTER_STYLES: FeedLayoutOuterStyles = {
  splitView: styles.splitView,
  desktopRightPane: styles.desktopRightPane,
};

export const BASE_FEED_LAYOUT_SETTINGS: FeedLayoutSettings = {
  withDesktopChatTitle: false,
};

const renderContentWrapper: RenderCommonFeedContentWrapper = ({
  children,
  wrapperStyles,
  commonData,
  commonMember,
  isGlobalDataFetched,
}) => (
  <MultipleSpacesLayoutPageContent
    headerContent={
      <HeaderContent
        common={commonData.common}
        commonMember={commonMember}
        governance={commonData.governance}
      />
    }
    isGlobalLoading={!isGlobalDataFetched}
    styles={wrapperStyles}
  >
    {children}
  </MultipleSpacesLayoutPageContent>
);

const CommonFeedPage: FC = () => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();
  const dispatch = useDispatch();
  const layoutMainWidth = useSelector(selectMultipleSpacesLayoutMainWidth);
  const lastCommonFromFeed = useSelector(selectCommonLayoutLastCommonFromFeed);
  const onActiveItemDataChange = useActiveItemDataChange();
  const feedLayoutSettings = useMemo<FeedLayoutSettings>(
    () => ({
      ...BASE_FEED_LAYOUT_SETTINGS,
      getSplitViewMaxSize: generateSplitViewMaxSizeGetter(layoutMainWidth),
    }),
    [layoutMainWidth],
  );
  const lastCommonFromFeedData = lastCommonFromFeed?.data;

  const renderLoadingHeader = lastCommonFromFeedData
    ? () => (
        <HeaderContentWrapper className={styles.headerContentWrapper}>
          <HeaderCommonContent
            commonId={lastCommonFromFeed.id}
            commonName={lastCommonFromFeedData.name}
            commonImage={lastCommonFromFeedData.image}
            isProject={lastCommonFromFeedData.isProject}
            memberCount={lastCommonFromFeedData.memberCount}
          />
        </HeaderContentWrapper>
      )
    : null;

  useEffect(() => {
    dispatch(
      multipleSpacesLayoutActions.configureBreadcrumbsData({
        type: InboxItemType.FeedItemFollow,
        activeCommonId: commonId,
      }),
    );
  }, [commonId]);

  useEffect(() => {
    return () => {
      dispatch(multipleSpacesLayoutActions.moveBreadcrumbsToPrevious());
    };
  }, []);

  return (
    <MainRoutesProvider>
      <BaseCommonFeedPage
        renderContentWrapper={renderContentWrapper}
        renderLoadingHeader={renderLoadingHeader}
        onActiveItemDataChange={onActiveItemDataChange}
        feedLayoutOuterStyles={FEED_LAYOUT_OUTER_STYLES}
        feedLayoutSettings={feedLayoutSettings}
      />
    </MainRoutesProvider>
  );
};

export default CommonFeedPage;
