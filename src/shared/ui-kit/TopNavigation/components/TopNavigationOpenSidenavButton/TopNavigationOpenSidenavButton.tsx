import React, { FC, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { SIDENAV_KEY, SIDENAV_OPEN } from "@/shared/constants";
import { getInboxPagePath } from "@/shared/utils";
import { TopNavigationBackButton } from "../TopNavigationBackButton";

interface TopNavigationOpenSidenavButtonProps {
  className?: string;
  iconEl?: ReactNode;
}

const TopNavigationOpenSidenavButton: FC<
  TopNavigationOpenSidenavButtonProps
> = (props) => {
  const { className, iconEl } = props;
  const history = useHistory();

  const openSidenav = () => {
    history.push({
      pathname: getInboxPagePath(),
      search: `?${SIDENAV_KEY}=${SIDENAV_OPEN}`,
    });
  };

  return (
    <TopNavigationBackButton
      className={className}
      iconEl={iconEl}
      onClick={openSidenav}
    />
  );
};

export default TopNavigationOpenSidenavButton;
