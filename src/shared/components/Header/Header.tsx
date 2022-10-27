import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, RouteProps, useHistory } from "react-router-dom";
import classNames from "classnames";
import { Routes } from "@/containers/MyAccount/components/Routes";
import { Loader, UserAvatar } from "@/shared/components";
import {
  useAnyMandatoryRoles,
  useMatchRoute,
  useOutsideClick,
  useScreenSize,
} from "@/shared/hooks";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import { UserRole } from "@/shared/models";
import {
  setAreReportsLoading,
  setTutorialModalState,
} from "@/shared/store/actions";
import {
  selectAreReportsLoading,
  selectHeader,
} from "@/shared/store/selectors";
import {
  logOut,
  setLoginModalState,
} from "../../../containers/Auth/store/actions";
import {
  authentificated,
  selectUser,
} from "../../../containers/Auth/store/selectors";
import { LoginContainer } from "../../../containers/Login/containers/LoginContainer";
import {
  ApiEndpoint,
  HEADER_MOBILE_SCREEN_SIZE,
  ROUTE_PATHS,
} from "../../constants";
import CloseIcon from "../../icons/close.icon";
import HamburgerIcon from "../../icons/hamburger.icon";
import { getUserName, isMobile, saveByURL } from "../../utils";
import { Account } from "../Account";
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
  const isDesktop = useScreenSize(`min-width: ${HEADER_MOBILE_SCREEN_SIZE}px`);
  const history = useHistory();
  const dispatch = useDispatch();
  const sharedHeaderState = useSelector(selectHeader());
  const areReportsLoading = useSelector(selectAreReportsLoading());
  const [showMenu, setShowMenu] = useState(false);
  const isAuthorized = useSelector(authentificated());
  const user = useSelector(selectUser());
  const myAccountBtnRef = useRef(null);
  const { isOutside } = useOutsideClick(myAccountBtnRef);
  const shouldDisplayAvatar = Boolean(!isDesktop && user);
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
  const shouldShowMenuItems =
    sharedHeaderState.shouldShowMenuItems ?? !isTrusteeRoute;
  const shouldShowAuth = sharedHeaderState.shouldShowAuth ?? !isTrusteeRoute;
  const shouldShowLanguageDropdown = isHomeRoute || isContactUsRoute;

  useEffect(() => {
    setShowAccountLinks(isMyAccountRoute);
  }, [showMenu, isMyAccountRoute]);

  const handleOpen = useCallback(() => {
    dispatch(setLoginModalState({ isShowing: true }));
    setShowMenu(false);
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

  const handleOpenTutorialModal = () => {
    dispatch(setTutorialModalState({ isShowing: true }));
  };

  const links = (
    <div className="navigation-wrapper" onClick={handleNavLinkClick}>
      {isAuthorized && isMobile() && (
        <button
          className="my-account-button-wrapper"
          onClick={() => setShowAccountLinks(!showAccountLinks)}
        >
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
          <button onClick={handleOpenTutorialModal}>App tour</button>
        </>
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

  if (shouldHideHeader) {
    return <LoginContainer />;
  }

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
      {isDesktop ? (
        <>
          {links}
          {shouldShowLanguageDropdown && <LanguageDropdown />}
          {user && (
            <Account
              user={user}
              logOut={logOutUser}
              isTrusteeRoute={isTrusteeRoute}
              hasAdminAccess={hasAdminAccess}
            />
          )}
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
      <LoginContainer />
    </section>
  );
};

export default Header;
