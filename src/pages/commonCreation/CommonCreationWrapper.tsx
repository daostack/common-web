import React, { FC } from "react";
import { CommonCreationPageProps } from "./BaseCommonCreation";
import CommonCreationPage from "./CommonCreation";

const CommonCreationWrapper: FC<CommonCreationPageProps> = (props) => (
  <CommonCreationPage {...props} isCommonCreation></CommonCreationPage>
);

export default CommonCreationWrapper;
