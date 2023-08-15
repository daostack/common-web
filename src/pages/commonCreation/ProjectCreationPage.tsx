import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseCommonCreation, {
  CommonCreationPageProps,
} from "./BaseCommonCreation";

const ProjectCreationPage: FC<CommonCreationPageProps> = (props) => (
  <MainRoutesProvider>
    <BaseCommonCreation {...props} />
  </MainRoutesProvider>
);

export default ProjectCreationPage;
