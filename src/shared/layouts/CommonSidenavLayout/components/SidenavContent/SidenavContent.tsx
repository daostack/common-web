import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import commonLogoSrc from "@/shared/assets/images/logo-sidenav-2.svg";
import { CommonLogo } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import {
  ContentStyles,
  MenuItemsPlacement,
  UserInfo,
} from "../../../SidenavLayout/components/SidenavContent";
import { Footer, Projects } from "./components";
import styles from "./SidenavContent.module.scss";

interface SidenavContentProps {
  className?: string;
}

const SidenavContent: FC<SidenavContentProps> = (props) => {
  const { className } = props;
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const separatorEl = <div className={styles.separator} />;
  const userInfoContentStyles: ContentStyles = {
    container: styles.userInfoContentButton,
    userAvatar: styles.userInfoAvatar,
    userName: styles.userInfoName,
  };

  return (
    <div className={classNames(styles.container, className)}>
      <CommonLogo
        className={styles.commonLogoContainer}
        logoClassName={styles.commonLogo}
        logoSrc={commonLogoSrc}
      />
      {separatorEl}
      <Projects />
      <div className={styles.userInfoSeparator} />
      <UserInfo
        avatarURL={user?.photoURL}
        userName={getUserName(user)}
        isAuthenticated={isAuthenticated}
        menuItemsPlacement={MenuItemsPlacement.Top}
        rightArrowIconClassName={styles.userInfoRightArrowIcon}
        contentStyles={userInfoContentStyles}
      />
      {separatorEl}
      <Footer />
    </div>
  );
};

export default SidenavContent;
