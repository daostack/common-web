import React, { FC, ReactNode, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { InboxItemType } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { FeedLayoutItemChangeDataWithType } from "@/shared/interfaces";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import { multipleSpacesLayoutActions } from "@/store/states";
import BaseInboxPage from "./BaseInbox";

const InboxPage: FC = () => {
  const dispatch = useDispatch();

  const handleActiveItemDataChange = useCallback(
    (data: FeedLayoutItemChangeDataWithType) => {
      if (data.type === InboxItemType.ChatChannel) {
        dispatch(
          multipleSpacesLayoutActions.configureBreadcrumbsData({
            type: data.type,
            activeItem: {
              id: data.itemId,
              name: data.title,
              image: data.image,
            },
          }),
        );
      }
      if (data.type === InboxItemType.FeedItemFollow) {
        dispatch(
          multipleSpacesLayoutActions.configureBreadcrumbsData({
            type: data.type,
            activeItem: {
              id: data.itemId,
              name: data.title,
            },
            activeCommonId: data.commonId,
          }),
        );
      }
    },
    [],
  );

  const renderContentWrapper = (children: ReactNode): ReactNode => (
    <MultipleSpacesLayoutPageContent headerContent={<div>Header</div>}>
      {children}
    </MultipleSpacesLayoutPageContent>
  );

  useEffect(() => {
    dispatch(multipleSpacesLayoutActions.moveBreadcrumbsToPrevious());
  }, []);

  return (
    <MainRoutesProvider>
      <BaseInboxPage
        renderContentWrapper={renderContentWrapper}
        onActiveItemDataChange={handleActiveItemDataChange}
      />
    </MainRoutesProvider>
  );
};

export default InboxPage;
