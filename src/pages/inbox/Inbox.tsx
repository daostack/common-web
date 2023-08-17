import React, { CSSProperties, FC, ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUserStreamsWithNotificationsAmount } from "@/pages/Auth/store/selectors";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import { selectMultipleSpacesLayoutMainWidth } from "@/store/states";
import { FeedLayoutSettings } from "../commonFeed";
import {
  FEED_LAYOUT_OUTER_STYLES,
  BASE_FEED_LAYOUT_SETTINGS,
} from "../commonFeed/CommonFeedPage";
import { useActiveItemDataChange } from "../commonFeed/hooks";
import { generateSplitViewMaxSizeGetter } from "../commonFeed/utils";
import BaseInboxPage from "./BaseInbox";
import { HeaderContent } from "./components";

const InboxPage: FC = () => {
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const layoutMainWidth = useSelector(selectMultipleSpacesLayoutMainWidth);
  const onActiveItemDataChange = useActiveItemDataChange();
  const feedLayoutSettings = useMemo<FeedLayoutSettings>(
    () => ({
      ...BASE_FEED_LAYOUT_SETTINGS,
      getSplitViewMaxSize: generateSplitViewMaxSizeGetter(layoutMainWidth),
    }),
    [layoutMainWidth],
  );

  const renderContentWrapper = (
    children: ReactNode,
    wrapperStyles?: CSSProperties,
  ): ReactNode => (
    <MultipleSpacesLayoutPageContent
      headerContent={
        <HeaderContent
          streamsWithNotificationsAmount={
            userStreamsWithNotificationsAmount || 0
          }
        />
      }
      styles={wrapperStyles}
    >
      {children}
    </MultipleSpacesLayoutPageContent>
  );

  return (
    <MainRoutesProvider>
      <BaseInboxPage
        renderContentWrapper={renderContentWrapper}
        onActiveItemDataChange={onActiveItemDataChange}
        feedLayoutOuterStyles={FEED_LAYOUT_OUTER_STYLES}
        feedLayoutSettings={feedLayoutSettings}
      />
    </MainRoutesProvider>
  );
};

export default InboxPage;
