import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, RouteProps, useHistory } from "react-router-dom";
import classNames from "classnames";
import { Routes } from "@/containers/MyAccount/components/Routes";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import { Loader, UserAvatar } from "@/shared/components";
import {
  useAnyMandatoryRoles,
  useMatchRoute,
  useOutsideClick,
} from "@/shared/hooks";
import { UserRole } from "@/shared/models";
import { setAreReportsLoading } from "@/shared/store/actions";
import {
  selectAreReportsLoading,
  selectHeader,
} from "@/shared/store/selectors";
import { ApiEndpoint, Colors, ROUTE_PATHS, ScreenSize } from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { getScreenSize } from "../../store/selectors";
import { getUserName, isMobile, saveByURL } from "../../utils";
import DownloadCommonApp from "../DownloadCommonApp/DownloadCommonApp";
import MobileLinks from "../MobileLinks/MobileLinks";
import { Account } from "../Account";
import {
  authentificated,
  selectUser,
} from "../../../containers/Auth/store/selectors";
import { LoginContainer } from "../../../containers/Login/containers/LoginContainer";
import {
  logOut,
  setLoginModalState,
} from "../../../containers/Auth/store/actions";
import { LanguageDropdown } from "./LanguageDropdown";
import "./index.scss";

const ADMIN_ACCESS_ROLES: UserRole[] = [UserRole.Trustee];

const NON_EXACT_MATCH_ROUTE_PROPS: RouteProps = {
  exact: false,
};

const EXACT_MATCH_ROUTE_PROPS: RouteProps = {
  exact: true,
};

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const sharedHeaderState = useSelector(selectHeader());
  const screenSize = useSelector(getScreenSize());
  const areReportsLoading = useSelector(selectAreReportsLoading());
  const [showMenu, setShowMenu] = useState(false);
  const isAuthorized = useSelector(authentificated());
  const user = useSelector(selectUser());
  const myAccountBtnRef = useRef(null);
  const { isOutside } = useOutsideClick(myAccountBtnRef);
  const shouldDisplayAvatar = Boolean(screenSize === ScreenSize.Mobile && user);
  const hasAdminAccess = useAnyMandatoryRoles(ADMIN_ACCESS_ROLES, user?.roles);
  const isTrusteeRoute = useMatchRoute(
    ROUTE_PATHS.TRUSTEE,
    NON_EXACT_MATCH_ROUTE_PROPS
  );
  const isTrusteeAuthRoute = useMatchRoute(
    ROUTE_PATHS.TRUSTEE_AUTH,
    EXACT_MATCH_ROUTE_PROPS
  );
  const isMyAccountRoute = useMatchRoute(
    ROUTE_PATHS.MY_ACCOUNT,
    NON_EXACT_MATCH_ROUTE_PROPS
  );
  const [showAccountLinks, setShowAccountLinks] =
    useState<boolean>(isMyAccountRoute);
  const shouldShowMenuItems =
    sharedHeaderState.shouldShowMenuItems ?? !isTrusteeRoute;
  const shouldShowDownloadLinks =
    sharedHeaderState.shouldShowDownloadLinks ?? !isTrusteeRoute;
  const shouldShowAuth = sharedHeaderState.shouldShowAuth ?? !isTrusteeRoute;

  useEffect(() => {
    setShowAccountLinks(isMyAccountRoute);
  }, [showMenu, isMyAccountRoute]);

  const handleOpen = useCallback(() => {
    dispatch(setLoginModalState({ isShowing: true }));
  }, [dispatch]);

  const handleReportsDownload = async () => {
    dispatch(setAreReportsLoading(true));
    await saveByURL(ApiEndpoint.GetReports, "reports.zip");
    dispatch(setAreReportsLoading(false));
  };

  React.useEffect(() => {
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

  const links = (
    <div className="navigation-wrapper" onClick={handleNavLinkClick}>
      {isAuthorized && isMobile() && (
        <button onClick={() => setShowAccountLinks(!showAccountLinks)}>
          <div ref={myAccountBtnRef} className="my-account-button">
            My Account
            <RightArrowIcon
              className={classNames("my-account-button__arrow-icon", {
                "my-account-button__arrow-icon--opened": showAccountLinks,
              })}
            />
          </div>

          {showAccountLinks && <Routes />}
        </button>
      )}

      {shouldShowMenuItems && isAuthorized && (
        <>
          <NavLink to="/" exact activeClassName="active">
            About
          </NavLink>
          <NavLink to={ROUTE_PATHS.COMMON_LIST} activeClassName="active">
            Explore
          </NavLink>
          <NavLink to={ROUTE_PATHS.MY_COMMONS} exact activeClassName="active">
            My Commons
          </NavLink>
        </>
      )}

      {isMobile() && (
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
      {!isAuthorized && shouldShowAuth && (
        <button className="login-button" onClick={handleOpen}>
          Login / Sign up
        </button>
      )}
    </div>
  );

  const headerWrapperClassName = classNames("header-wrapper", {
    "header-wrapper--without-shadow": isTrusteeRoute && !isTrusteeAuthRoute,
  });

  return (
    <section className={headerWrapperClassName}>
      {shouldDisplayAvatar && (
        <UserAvatar
          photoURL={user?.photoURL}
          nameForRandomAvatar={user?.email}
          userName={getUserName(user)}
          onClick={toggleMenuShowing}
        />
      )}
      <Link
        to="/"
        className={classNames("common-logo", {
          "common-logo--without-avatar": !shouldDisplayAvatar,
        })}
      >
        <img src="/icons/logo.svg" alt="logo" className="logo" />
      </Link>
      {screenSize === ScreenSize.Desktop ? (
        <>
          {links}
          <LanguageDropdown />
          {user && (
            <Account
              user={user}
              logOut={logOutUser}
              isTrusteeRoute={isTrusteeRoute}
              hasAdminAccess={hasAdminAccess}
            />
          )}
          {!isAuthorized && shouldShowDownloadLinks ? (
            <div className="mobile-links-container">
              <MobileLinks color={Colors.black} />
            </div>
          ) : null}
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
          {showMenu && (
            <div className="menu-wrapper">
              {shouldShowDownloadLinks && (
                <DownloadCommonApp
                  setHasClosedPopup={() => {
                    return true;
                  }}
                  inMenu={true}
                />
              )}
              {links}
            </div>
          )}
        </>
      )}
      <LoginContainer />
    </section>
  );
};

export default Header;
