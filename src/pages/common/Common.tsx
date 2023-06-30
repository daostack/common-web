import React from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import BaseCommonPage from "./BaseCommon";
import { CommonPageSettings } from "./types";
import styles from "./Common.module.scss";

const SETTINGS: CommonPageSettings = {
  pageContentClassName: styles.mainPageContent,
  renderHeaderContent: () => null,
};

const Common = () => (
  <MainRoutesProvider>
    <BaseCommonPage settings={SETTINGS} />
  </MainRoutesProvider>
);

export default Common;
