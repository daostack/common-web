import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { LongLeftArrowIcon } from "@/shared/icons";
import {
  TopNavigationBackButton,
  TopNavigationWithBlocks,
} from "@/shared/ui-kit";
import styles from "./Header.module.scss";

interface HeaderProps {
  className?: string;
}

const Header: FC<HeaderProps> = (props) => {
  const { className } = props;
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const isTabletView = useIsTabletView();
  const { getProfilePagePath } = useRoutesContext();

  if (!isTabletView) {
    return (
      <header className={classNames(styles.desktopContainer, className)}>
        <h1 className={styles.desktopTitle}>Settings</h1>
      </header>
    );
  }

  const handleBackButtonClick = () => {
    if (canGoBack) {
      goBack();
    } else {
      history.push(getProfilePagePath());
    }
  };

  return (
    <TopNavigationWithBlocks
      className={styles.topNavigationWithBlocks}
      leftElement={
        <TopNavigationBackButton
          iconEl={<LongLeftArrowIcon className={styles.backIcon} />}
          onClick={handleBackButtonClick}
        />
      }
      centralElement={<h2 className={styles.mobileTitle}>Settings</h2>}
    />
  );
};

export default Header;
