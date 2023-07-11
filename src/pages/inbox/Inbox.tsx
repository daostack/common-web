import React, { CSSProperties, FC, ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectUserStreamsWithNotificationsAmount } from "@/pages/Auth/store/selectors";
import { useActiveItemDataChange } from "@/pages/commonFeed/hooks";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import {
  FEED_LAYOUT_OUTER_STYLES,
  FEED_LAYOUT_SETTINGS,
} from "../commonFeed/CommonFeedPage";
import BaseInboxPage from "./BaseInbox";
import { HeaderContent } from "./components";

const InboxPage: FC = () => {
  const userStreamsWithNotificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const onActiveItemDataChange = useActiveItemDataChange();

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
        feedLayoutSettings={FEED_LAYOUT_SETTINGS}
      />
    </MainRoutesProvider>
  );
};

export default InboxPage;
