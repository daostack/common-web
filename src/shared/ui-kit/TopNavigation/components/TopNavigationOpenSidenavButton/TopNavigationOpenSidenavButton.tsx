import React from "react";
import { SIDENAV_ID } from "@/shared/constants";
import { TopNavigationBackButton } from "../TopNavigationBackButton";

const TopNavigationOpenSidenavButton = () => {
  const handleOpen = () => {
    window.location.hash = SIDENAV_ID;
  };

  return <TopNavigationBackButton onClick={handleOpen} />;
};

export default TopNavigationOpenSidenavButton;
