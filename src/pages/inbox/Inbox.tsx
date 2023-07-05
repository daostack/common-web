import React, { CSSProperties, FC, ReactNode } from "react";
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
  const onActiveItemDataChange = useActiveItemDataChange();

  const renderContentWrapper = (
    children: ReactNode,
    wrapperStyles?: CSSProperties,
  ): ReactNode => (
    <MultipleSpacesLayoutPageContent
      headerContent={<HeaderContent />}
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
