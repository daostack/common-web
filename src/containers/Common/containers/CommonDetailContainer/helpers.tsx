import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import { Tabs } from "./constants";

export const getInitialTab = (defaultTab: string): Tabs => {
  const isCorrectTab = Object.values(Tabs).includes(defaultTab as Tabs);

  return isCorrectTab ? (defaultTab as Tabs) : Tabs.About;
};

export const getCommonSubtitle = (): ReactNode | null => {
  if (true) {
    return (
      <>
        Sub Commons: <Link to={ROUTE_PATHS.COMMON_DETAIL}>Subcommon 1</Link>,{" "}
        <Link to={ROUTE_PATHS.COMMON_DETAIL}>Subcommon 2</Link>
      </>
    );
  }

  return null;
};
