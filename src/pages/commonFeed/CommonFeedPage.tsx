import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { InboxItemType } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { MultipleSpacesLayoutPageContent } from "@/shared/layouts";
import { checkIsProject } from "@/shared/utils";
import { multipleSpacesLayoutActions } from "@/store/states";
import BaseCommonFeedPage, {
  CommonFeedPageRouterParams,
} from "./BaseCommonFeedPage";
import { RenderCommonFeedContentWrapper } from "./CommonFeed";
import { HeaderContent } from "./components";
import { useActiveItemDataChange } from "./hooks";

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
  </MultipleSpacesLayoutPageContent>
);
const CommonFeedPage: FC = () => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();
  const dispatch = useDispatch();
  const onActiveItemDataChange = useActiveItemDataChange();

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
        onActiveItemDataChange={onActiveItemDataChange}
      />
    </MainRoutesProvider>
  );
};

export default CommonFeedPage;
