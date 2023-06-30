import React, { FC } from "react";
import { useParams } from "react-router-dom";
import CommonFeed, { CommonFeedProps } from "./CommonFeed";

export interface CommonFeedPageRouterParams {
  id: string;
}

const BaseCommonFeedPage: FC<
  Pick<CommonFeedProps, "renderContentWrapper" | "onActiveItemDataChange">
> = (props) => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();

  return <CommonFeed key={commonId} commonId={commonId} {...props} />;
};

export default BaseCommonFeedPage;
