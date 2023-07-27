import React, { CSSProperties, FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import {
  useLayoutRouteContext,
  MultipleSpacesLayoutRouteOptions,
} from "@/pages/App/router";
import { MainRoutesProvider } from "@/shared/contexts";
import { useLockedBody } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Sidenav } from "@/shared/ui-kit";
import { selectMultipleSpacesLayoutBackUrl } from "@/store/states";
import { getSidenavLeft } from "../CommonSidenavLayout/utils";
import { Header, SidenavContent } from "./components";
import styles from "./MultipleSpacesLayout.module.scss";

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<MultipleSpacesLayoutRouteOptions>();
  const backUrl = useSelector(selectMultipleSpacesLayoutBackUrl);
  const isTabletView = useIsTabletView();
  const { width } = useWindowSize();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
  } as CSSProperties;

  const handleSidenavOpenToggle = useCallback(
    (isOpen: boolean) => {
      setIsSidenavOpen(isOpen);

      if (!isTabletView) {
        return;
      }
      if (isOpen) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }
    },
    [isTabletView, lockBodyScroll, unlockBodyScroll],
  );

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
          shouldCheckViewportForOpenState={false}
          withAnimation
          onOpenToggle={handleSidenavOpenToggle}
        >
          <SidenavContent className={styles.sidenavContent} />
        </Sidenav>
        <main className={styles.main}>
          {!isTabletView && (
            <Header
              backUrl={backUrl}
              withBreadcrumbs={routeOptions.withBreadcrumbs}
              breadcrumbsItemsWithMenus={routeOptions.breadcrumbsItemsWithMenus}
              withMenuButton={!isSidenavOpen}
            />
          )}
          {children}
        </main>
      </div>
    </MainRoutesProvider>
  );
};

export default MultipleSpacesLayout;
