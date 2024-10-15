import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, RouteProps, useHistory } from "react-router-dom";
import classNames from "classnames";
import { Routes } from "@/pages/MyAccount/components/Routes";
import { NotificationService } from "@/services";
import { Loader } from "@/shared/components";
import {
  useAnyMandatoryRoles,
  useMatchRoute,
  useOutsideClick,
  useScreenSize,
} from "@/shared/hooks";
import { UserRole } from "@/shared/models";
import { setAreReportsLoading } from "@/shared/store/actions";
import {
  selectAreReportsLoading,
  selectHeader,
} from "@/shared/store/selectors";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { logOut, setLoginModalState } from "../../../pages/Auth/store/actions";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../../pages/Auth/store/selectors";
import {
  ApiEndpoint,
  HEADER_MOBILE_SCREEN_SIZE,
  ROUTE_PATHS,
} from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { isMobile, saveByURL } from "../../utils";
import { LanguageDropdown } from "./LanguageDropdown";
import styles from "./Header.module.scss";
import "./index.scss";

const ADMIN_ACCESS_ROLES: UserRole[] = [UserRole.Trustee];

const NON_EXACT_MATCH_ROUTE_PROPS: RouteProps = {
  exact: false,
};

const EXACT_MATCH_ROUTE_PROPS: RouteProps = {
  exact: true,
};

const Header = () => {
  const isDesktop = useScreenSize(`min-width: ${HEADER_MOBILE_SCREEN_SIZE}px`);
  const history = useHistory();
  const dispatch = useDispatch();
  const sharedHeaderState = useSelector(selectHeader());
  const areReportsLoading = useSelector(selectAreReportsLoading());
  const [showMenu, setShowMenu] = useState(false);
  const isAuthorized = useSelector(selectIsAuthenticated());
  const user = useSelector(selectUser());
  const myAccountBtnRef = useRef(null);
  const { isOutside } = useOutsideClick(myAccountBtnRef);
  const hasAdminAccess = useAnyMandatoryRoles(ADMIN_ACCESS_ROLES, user?.roles);
  const isTrusteeRoute = useMatchRoute(
    ROUTE_PATHS.TRUSTEE,
    NON_EXACT_MATCH_ROUTE_PROPS,
  );
  const isTrusteeAuthRoute = useMatchRoute(
    ROUTE_PATHS.TRUSTEE_AUTH,
    EXACT_MATCH_ROUTE_PROPS,
  );
  const isMyAccountRoute = useMatchRoute(
    ROUTE_PATHS.MY_ACCOUNT,
    NON_EXACT_MATCH_ROUTE_PROPS,
  );
  const isHomeRoute = useMatchRoute(ROUTE_PATHS.HOME, EXACT_MATCH_ROUTE_PROPS);
  const isContactUsRoute = useMatchRoute(
    ROUTE_PATHS.CONTACT_US,
    EXACT_MATCH_ROUTE_PROPS,
  );
  const [showAccountLinks, setShowAccountLinks] =
    useState<boolean>(isMyAccountRoute);
  const shouldHideHeader = sharedHeaderState.shouldHideHeader ?? false;
  const shouldShowLanguageDropdown = isHomeRoute || isContactUsRoute;

  useEffect(() => {
    setShowAccountLinks(isMyAccountRoute);
  }, [showMenu, isMyAccountRoute]);

  const handleLogIn = useCallback(async () => {
    await NotificationService.requestPermissions();
    dispatch(setLoginModalState({ isShowing: true }));
    setShowMenu(false);
  }, [dispatch]);

  const handleReportsDownload = async () => {
    dispatch(setAreReportsLoading(true));
    await saveByURL(ApiEndpoint.GetReports, "reports.zip");
    dispatch(setAreReportsLoading(false));
  };

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);

  const toggleMenuShowing = () => {
    setShowMenu((shouldShow) => !shouldShow);
  };

  const handleNavLinkClick = () => {
    if (showMenu && isOutside) {
      setShowMenu(false);
    }
  };

  const logOutUser = () => {
    dispatch(logOut());
  };

  const handleLaunchApp = async () => {
    await NotificationService.requestPermissions();
    history.push(ROUTE_PATHS.INBOX);
  };

  const links = (
    <div className="navigation-wrapper" onClick={handleNavLinkClick}>
      {isAuthorized && isMobile() && (
        <button
          className="my-account-button-wrapper"
          onClick={() => setShowAccountLinks(!showAccountLinks)}
        >
          {showAccountLinks && <Routes />}
        </button>
      )}

      {shouldShowLanguageDropdown && isMobile() && (
        <div
          className="header-wrapper__language-dropdown-wrapper"
          onClick={(event) => event.stopPropagation()}
        >
          <LanguageDropdown />
        </div>
      )}
      {isAuthorized && isMobile() && (
        <>
          {hasAdminAccess && (
            <button
              className="header-wrapper__mobile-link"
              onClick={handleReportsDownload}
              disabled={areReportsLoading}
            >
              Download Reports
              {areReportsLoading && (
                <Loader className="header-wrapper__link-loader" />
              )}
            </button>
          )}
          <button onClick={logOutUser}>Log out</button>
        </>
      )}
    </div>
  );

  const headerWrapperClassName = classNames("header-wrapper", {
    "header-wrapper--without-shadow": isTrusteeRoute && !isTrusteeAuthRoute,
  });

  if (shouldHideHeader) {
    return null;
  }

  const appButton = (
    <Button
      className={styles.appButton}
      onClick={!isAuthorized ? handleLogIn : handleLaunchApp}
      variant={ButtonVariant.PrimaryPink}
    >
      Launch App
    </Button>
  );

  return (
    <section className={headerWrapperClassName}>
      {!isDesktop && appButton}
      <Link to="/" className="common-logo">
        <img src="/icons/logo.svg" alt="logo" className="logo" />
      </Link>
      {isDesktop ? (
        <>
          {links}
          {shouldShowLanguageDropdown && <LanguageDropdown />}
          {appButton}
        </>
      ) : (
        <>
          <div className="humburger-menu" onClick={toggleMenuShowing}>
            {showMenu ? (
              <CloseIcon width="24" height="24" />
            ) : (
              <HamburgerIcon />
            )}
          </div>
          {showMenu && <div className="menu-wrapper">{links}</div>}
        </>
      )}
    </section>
  );
};

export default Header;
