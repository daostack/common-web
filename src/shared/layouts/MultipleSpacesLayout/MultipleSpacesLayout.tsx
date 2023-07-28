import React, { CSSProperties, FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
import { selectMultipleSpacesLayoutBackUrl } from "@/store/states";
import { getSidenavLeft } from "../CommonSidenavLayout/utils";
import { Header, SidenavContent } from "./components";
import styles from "./MultipleSpacesLayout.module.scss";

const MULTIPLE_SPACES_LAYOUT_SIDENAV_OPEN_STATE = "open";

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const queryParams = useQueryParams();
  const { routeOptions = {} } =
    useLayoutRouteContext<MultipleSpacesLayoutRouteOptions>();
  const backUrl = useSelector(selectMultipleSpacesLayoutBackUrl);
  const isTabletView = useIsTabletView();
  const { width } = useWindowSize();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const isSidenavOpenFromQueryParams = checkIsSidenavOpen(queryParams);
  const [isSidenavOpen, setIsSidenavOpen] = useState(
    () =>
      localStorage.getItem(StorageKey.MultipleSpacesLayoutSidenavState) ===
        MULTIPLE_SPACES_LAYOUT_SIDENAV_OPEN_STATE ??
      isSidenavOpenFromQueryParams,
  );
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
  } as CSSProperties;

  const handleSidenavOpen = () => {
    setIsSidenavOpen(true);
    localStorage.setItem(
      StorageKey.MultipleSpacesLayoutSidenavState,
      MULTIPLE_SPACES_LAYOUT_SIDENAV_OPEN_STATE,
    );
    openSidenav();
  };

  const handleSidenavClose = () => {
    setIsSidenavOpen(false);
    localStorage.removeItem(StorageKey.MultipleSpacesLayoutSidenavState);
    closeSidenav();
  };

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
          <SidenavContent
            className={styles.sidenavContent}
            onClose={handleSidenavClose}
          />
        </Sidenav>
        <main className={styles.main}>
          {!isTabletView && (
            <Header
              backUrl={backUrl}
              withBreadcrumbs={routeOptions.withBreadcrumbs}
              breadcrumbsItemsWithMenus={routeOptions.breadcrumbsItemsWithMenus}
              withMenuButton={!isSidenavOpen}
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
