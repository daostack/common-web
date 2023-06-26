import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import BaseCommonFeedPage from "./BaseCommonFeedPage";

const CommonFeedPage: FC = () => (
  <RoutesV04Provider>
    <BaseCommonFeedPage />
  </RoutesV04Provider>
);

export default CommonFeedPage;
