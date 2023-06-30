import React, { FC, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { InboxItemType } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { FeedLayoutItemChangeDataWithType } from "@/shared/interfaces";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import { multipleSpacesLayoutActions } from "@/store/states";
import BaseCommonFeedPage, {
  CommonFeedPageRouterParams,
} from "./BaseCommonFeedPage";
import { RenderCommonFeedContentWrapper } from "./CommonFeed";

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
const CommonFeedPage: FC = () => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();
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

  useEffect(() => {
    dispatch(
      multipleSpacesLayoutActions.configureBreadcrumbsData({
        type: InboxItemType.FeedItemFollow,
        activeCommonId: commonId,
      }),
    );
  }, [commonId]);

  return (
    <MainRoutesProvider>
      <BaseCommonFeedPage
        renderContentWrapper={renderContentWrapper}
        onActiveItemDataChange={handleActiveItemDataChange}
      />
    </MainRoutesProvider>
  );
};

export default CommonFeedPage;
