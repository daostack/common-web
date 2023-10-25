import React, { CSSProperties, FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import {
  useLayoutRouteContext,
  MultipleSpacesLayoutRouteOptions,
} from "@/pages/App/router";
import { StorageKey } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { useLockedBody, useQueryParams } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Sidenav } from "@/shared/ui-kit";
import { checkIsSidenavOpen, closeSidenav, openSidenav } from "@/shared/utils";
import {
  multipleSpacesLayoutActions,
  selectMultipleSpacesLayoutBackUrl,
} from "@/store/states";
import { getSidenavLeft } from "../CommonSidenavLayout/utils";
import { Header, /* SidenavContent */ } from "./components";
import { SidenavContent as SidenavContentV04 } from "../CommonSidenavLayout/components";
import styles from "./MultipleSpacesLayout.module.scss";

const MULTIPLE_SPACES_LAYOUT_SIDENAV_OPEN_STATE = "open";
const MULTIPLE_SPACES_LAYOUT_SIDENAV_WIDTH = 336;

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const { routeOptions = {} } =
    useLayoutRouteContext<MultipleSpacesLayoutRouteOptions>();
  const backUrl = useSelector(selectMultipleSpacesLayoutBackUrl);
  const isTabletView = useIsTabletView();
  const { width } = useWindowSize();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const isSidenavDisabled = !isTabletView && routeOptions.withSidenav === false;
  const isSidenavOpenFromQueryParams = checkIsSidenavOpen(queryParams);
  const [isSidenavTechnicallyOpen, setIsSidenavTechnicallyOpen] = useState(
    () =>
      localStorage.getItem(StorageKey.MultipleSpacesLayoutSidenavState) ===
        MULTIPLE_SPACES_LAYOUT_SIDENAV_OPEN_STATE ??
      isSidenavOpenFromQueryParams,
  );
  const isSidenavOpen = !isSidenavDisabled && isSidenavTechnicallyOpen;
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
  } as CSSProperties;
  const mainWidth =
    isSidenavOpen && !isTabletView
      ? width - MULTIPLE_SPACES_LAYOUT_SIDENAV_WIDTH
      : width;

  const handleSidenavOpen = () => {
    setIsSidenavTechnicallyOpen(true);
    localStorage.setItem(
      StorageKey.MultipleSpacesLayoutSidenavState,
      MULTIPLE_SPACES_LAYOUT_SIDENAV_OPEN_STATE,
    );
    openSidenav();
  };

  const handleSidenavClose = () => {
    setIsSidenavTechnicallyOpen(false);
    localStorage.removeItem(StorageKey.MultipleSpacesLayoutSidenavState);
    closeSidenav();
  };

  useEffect(() => {
    dispatch(multipleSpacesLayoutActions.setMainWidth(mainWidth));
  }, [mainWidth]);

  useEffect(() => {
    if (!isTabletView) {
      return;
    }
    if (isSidenavOpenFromQueryParams) {
      handleSidenavOpen();
    } else {
      handleSidenavClose();
    }
  }, [isSidenavOpenFromQueryParams, isTabletView]);

  useEffect(() => {
    if (!isTabletView) {
      return;
    }
    if (isSidenavOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
  }, [isSidenavOpen, isTabletView]);

  return (
    <MainRoutesProvider>
      <div
        className={classNames(styles.container, {
          [styles.containerWithOpenedSidenav]: isSidenavOpen,
        })}
        style={style}
      >
        <Sidenav
          className={styles.sidenav}
          contentWrapperClassName={styles.sidenavContentWrapper}
          style={{ left: sidenavLeft }}
          isOpen={isSidenavOpen}
          shouldCheckViewportForOpenState={false}
          withAnimation
        >
          <SidenavContentV04
            className={styles.sidenavContent}
            // onClose={handleSidenavClose}
          />
        </Sidenav>
        <main className={styles.main}>
          {!isTabletView && (
            <Header
              backUrl={backUrl}
              withBreadcrumbs={routeOptions.withBreadcrumbs}
              breadcrumbsItemsWithMenus={routeOptions.breadcrumbsItemsWithMenus}
              withMenuButton={!isSidenavDisabled && !isSidenavOpen}
              withGoBack={routeOptions.withGoBack ?? false}
              onMenuClick={handleSidenavOpen}
            />
          )}
          {children}
        </main>
      </div>
    </MainRoutesProvider>
  );
};

export default MultipleSpacesLayout;
