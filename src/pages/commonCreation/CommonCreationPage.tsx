import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseCommonCreation, {
  CommonCreationPageProps,
} from "./BaseCommonCreation";

const CommonCreationPage: FC<CommonCreationPageProps> = (props) => (
  <MainRoutesProvider>
    <BaseCommonCreation {...props} />
  </MainRoutesProvider>
);

export default CommonCreationPage;
