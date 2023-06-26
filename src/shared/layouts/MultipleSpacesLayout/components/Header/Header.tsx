import React, { FC } from "react";
import { useSelector } from "react-redux";
import { authentificated, selectUser } from "@/pages/Auth/store/selectors";
import { getUserName } from "@/shared/utils";
import {
  ContentStyles,
  MenuItemsPlacement,
  MenuItemsStyles,
  UserInfo,
} from "../../../SidenavLayout/components/SidenavContent";
import { Navigation } from "./components";
import styles from "./Header.module.scss";

interface HeaderProps {
  a?: string;
}

const Header: FC<HeaderProps> = (props) => {
  const { a } = props;
  const isAuthenticated = useSelector(authentificated());
  const user = useSelector(selectUser());
  const userInfoContentStyles: ContentStyles = {
    container: styles.userInfoContentButton,
    userAvatar: styles.userInfoAvatar,
    userName: styles.userInfoName,
  };
  const menuItemsStyles: MenuItemsStyles = {
    wrapper: styles.menuItemsWrapper,
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>Breadcrumbs</div>
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
