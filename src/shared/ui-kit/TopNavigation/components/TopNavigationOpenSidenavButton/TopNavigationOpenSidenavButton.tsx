import React, { FC, ReactNode } from "react";
import { openSidenav } from "@/shared/utils";
import { TopNavigationBackButton } from "../TopNavigationBackButton";

interface TopNavigationOpenSidenavButtonProps {
  className?: string;
  iconEl?: ReactNode;
  onClick?: () => void;
}

const TopNavigationOpenSidenavButton: FC<
  TopNavigationOpenSidenavButtonProps
> = (props) => {
  const { className, iconEl, onClick } = props;

  return (
    <TopNavigationBackButton
      className={className}
      iconEl={iconEl}
      onClick={onClick ?? openSidenav}
    />
  );
};

export default TopNavigationOpenSidenavButton;
