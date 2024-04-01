import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  selectIsAuthenticated,
  selectUser,
} from "@/pages/Auth/store/selectors";
import { ButtonIcon } from "@/shared/components";
import { useGoBack } from "@/shared/hooks";
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
  withGoBack: boolean;
  onMenuClick?: () => void;
}

const Header: FC<HeaderProps> = (props) => {
  const {
    backUrl = null,
    withBreadcrumbs = true,
    breadcrumbsItemsWithMenus = true,
    withMenuButton = true,
    onMenuClick,
  } = props;
  const { canGoBack, goBack } = useGoBack();
  const history = useHistory();
  const isAuthenticated = useSelector(selectIsAuthenticated());
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
  const withGoBack = Boolean(props.withGoBack && (backUrl || canGoBack));

  const handleGoBack = () => {
    if (backUrl) {
      history.push(backUrl);
    } else if (canGoBack) {
      goBack();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        {withMenuButton && (
          <TopNavigationOpenSidenavButton
            className={styles.menuButton}
            onClick={onMenuClick}
          />
        )}
        {withBreadcrumbs && !withGoBack && (
          <Breadcrumbs itemsWithMenus={breadcrumbsItemsWithMenus} />
        )}
        {withGoBack && (
          <ButtonIcon className={styles.backLink} onClick={handleGoBack}>
            <LongLeftArrowIcon className={styles.backIcon} />
            Back
          </ButtonIcon>
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
