import React, { FC } from "react";
import { useParams } from "react-router-dom";
import CommonFeed from "./CommonFeed";

interface CommonFeedPageRouterParams {
  id: string;
}

const CommonFeedPage: FC = () => {
  const { id: commonId } = useParams<CommonFeedPageRouterParams>();

  return <CommonFeed key={commonId} commonId={commonId} />;
};

export default CommonFeedPage;
