import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseCommonCreation, { CommonCreationProps } from "./BaseCommonCreation";

const CommonCreation: FC<CommonCreationProps> = (props) => (
  <MainRoutesProvider>
    <BaseCommonCreation {...props} />
  </MainRoutesProvider>
);

export default CommonCreation;
