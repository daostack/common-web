import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import classNames from "classnames";
import { useRoutesContext } from "@/shared/contexts";
import { useGoBack } from "@/shared/hooks";
import { LongLeftArrowIcon } from "@/shared/icons";
import {
  TopNavigationBackButton,
  TopNavigationWithBlocks,
} from "@/shared/ui-kit";
import styles from "./Header.module.scss";

interface HeaderProps {
  className?: string;
  isMobileVersion?: boolean;
}

const Header: FC<HeaderProps> = (props) => {
  const { className, isMobileVersion = false } = props;
  const history = useHistory();
  const { canGoBack, goBack } = useGoBack();
  const { getProfilePagePath } = useRoutesContext();

  if (!isMobileVersion) {
    return (
      <header className={classNames(styles.desktopContainer, className)}>
        <h1 className={styles.desktopTitle}>Billing</h1>
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
      centralElement={<h2 className={styles.mobileTitle}>Billing</h2>}
    />
  );
};

export default Header;
