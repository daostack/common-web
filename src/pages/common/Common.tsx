import React from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseCommonPage from "./BaseCommon";

const Common = () => (
  <MainRoutesProvider>
    <BaseCommonPage />
  </MainRoutesProvider>
);

export default Common;
