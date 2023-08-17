import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import BaseCommonCreation, {
  CommonCreationPageProps,
} from "./BaseCommonCreation";

const ProjectCreationPage_v04: FC<CommonCreationPageProps> = (props) => (
  <RoutesV04Provider>
    <BaseCommonCreation {...props} />
  </RoutesV04Provider>
);

export default ProjectCreationPage_v04;
