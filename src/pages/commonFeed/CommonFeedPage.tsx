import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseCommonFeedPage from "./BaseCommonFeedPage";

const CommonFeedPage: FC = () => (
  <MainRoutesProvider>
    <BaseCommonFeedPage />
  </MainRoutesProvider>
);

export default CommonFeedPage;
