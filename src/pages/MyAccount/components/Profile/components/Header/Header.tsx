import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import styles from "@/pages/settings/components/Settings/components/Header/Header.module.scss";
import { useGoBack } from "@/shared/hooks";
import { LongLeftArrowIcon } from "@/shared/icons";
import {
  TopNavigationBackButton,
  TopNavigationWithBlocks,
} from "@/shared/ui-kit";

interface HeaderProps {
  className?: string;
  isEditing: boolean;
  isMobileVersion?: boolean;
  editButtonEl: ReactNode;
}

const Header: FC<HeaderProps> = (props) => {
  const { className, isEditing, isMobileVersion = false, editButtonEl } = props;
  const { canGoBack, goBack } = useGoBack();

  if (!isMobileVersion) {
    return (
      <header className={classNames(styles.desktopContainer, className)}>
        <h1 className={styles.desktopTitle}>
          {isEditing ? "Edit Profile" : "My Profile"}
        </h1>
        {!isEditing && editButtonEl}
      </header>
    );
  }

  return (
    <TopNavigationWithBlocks
      className={styles.topNavigationWithBlocks}
      leftElement={
        canGoBack && !isEditing ? (
          <TopNavigationBackButton
            iconEl={<LongLeftArrowIcon className={styles.backIcon} />}
            onClick={goBack}
          />
        ) : null
      }
      centralElement={
        isEditing && <h2 className={styles.mobileTitle}>Edit profile</h2>
      }
      rightElement={!isEditing && editButtonEl}
    />
  );
};

export default Header;
