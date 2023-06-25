import React, { FC, ReactNode } from "react";
import { openSidenav } from "@/shared/utils";
import { TopNavigationBackButton } from "../TopNavigationBackButton";

interface TopNavigationOpenSidenavButtonProps {
  className?: string;
  iconEl?: ReactNode;
}

const TopNavigationOpenSidenavButton: FC<
  TopNavigationOpenSidenavButtonProps
> = (props) => {
  const { className, iconEl } = props;

  return (
    <TopNavigationBackButton
      className={className}
      iconEl={iconEl}
      onClick={openSidenav}
    />
  );
};

export default TopNavigationOpenSidenavButton;
