import React, { FC, ReactNode } from "react";
import { SIDENAV_ID } from "@/shared/constants";
import { TopNavigationBackButton } from "../TopNavigationBackButton";

interface TopNavigationOpenSidenavButtonProps {
  className?: string;
  iconEl?: ReactNode;
}

const TopNavigationOpenSidenavButton: FC<
  TopNavigationOpenSidenavButtonProps
> = (props) => {
  const { className, iconEl } = props;

  const handleOpen = () => {
    window.location.hash = SIDENAV_ID;
  };

  return (
    <TopNavigationBackButton
      className={className}
      iconEl={iconEl}
      onClick={handleOpen}
    />
  );
};

export default TopNavigationOpenSidenavButton;
