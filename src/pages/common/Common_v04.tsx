import React from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import BaseCommonPage from "./BaseCommon";

const Common = () => (
  <RoutesV04Provider>
    <BaseCommonPage />
  </RoutesV04Provider>
);

export default Common;
