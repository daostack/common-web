import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import BaseCommonCreation, { CommonCreationProps } from "./BaseCommonCreation";

const CommonCreationV04: FC<CommonCreationProps> = (props) => (
  <RoutesV04Provider>
    <BaseCommonCreation {...props} />
  </RoutesV04Provider>
);

export default CommonCreationV04;
