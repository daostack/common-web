import React, { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import { LongLeftArrowIcon } from "@/shared/icons";
import { TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import {
  ContentStyles,
  MenuItemsPlacement,
  MenuItemsStyles,
  UserInfo,
} from "../../../SidenavLayout/components/SidenavContent";
import { Breadcrumbs, Navigation } from "./components";
import styles from "./Header.module.scss";

interface HeaderProps {
  backUrl?: string | null;
  withBreadcrumbs?: boolean;
  breadcrumbsItemsWithMenus?: boolean;
  withMenuButton?: boolean;
}

const Header: FC<HeaderProps> = (props) => {
  const {
    backUrl = null,
    withBreadcrumbs = true,
    breadcrumbsItemsWithMenus = true,
    withMenuButton = true,
  } = props;
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const userInfoContentStyles: ContentStyles = {
    container: styles.userInfoContentButton,
    userAvatar: styles.userInfoAvatar,
    userName: styles.userInfoName,
    loginButton: styles.userInfoLoginButton,
  };
  const menuItemsStyles: MenuItemsStyles = {
    wrapper: styles.menuItemsWrapper,
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        {withMenuButton && (
          <TopNavigationOpenSidenavButton className={styles.menuButton} />
        )}
        {withBreadcrumbs && !backUrl && (
          <Breadcrumbs itemsWithMenus={breadcrumbsItemsWithMenus} />
        )}
        {backUrl && (
          <NavLink className={styles.backLink} to={backUrl}>
            <LongLeftArrowIcon className={styles.backIcon} />
            Back
          </NavLink>
        )}
      </div>
      <div className={styles.rightContent}>
        <Navigation className={styles.navigation} />
        <UserInfo
          className={styles.userInfo}
          avatarURL={user?.photoURL}
          userName={getUserName(user)}
          isAuthenticated={isAuthenticated}
          menuItemsPlacement={MenuItemsPlacement.Bottom}
          rightArrowIconClassName={styles.userInfoRightArrowIcon}
          contentStyles={userInfoContentStyles}
          menuItemsStyles={menuItemsStyles}
        />
      </div>
    </div>
  );
};

export default Header;
