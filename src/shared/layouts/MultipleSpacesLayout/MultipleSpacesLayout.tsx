import React, { CSSProperties, FC, useCallback } from "react";
import { useWindowSize } from "react-use";
import { MainRoutesProvider } from "@/shared/contexts";
import { useLockedBody } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "../CommonSidenavLayout/components";
import { getSidenavLeft } from "../CommonSidenavLayout/utils";
import { Header } from "./components";
import styles from "./MultipleSpacesLayout.module.scss";

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const isTabletView = useIsTabletView();
  const { width } = useWindowSize();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
  } as CSSProperties;

  const handleSidenavOpenToggle = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }
    },
    [lockBodyScroll, unlockBodyScroll],
  );

  return (
    <MainRoutesProvider>
      <div className={styles.container} style={style}>
        {isTabletView && (
          <Sidenav
            contentWrapperClassName={styles.sidenavContentWrapper}
            onOpenToggle={handleSidenavOpenToggle}
          >
            <SidenavContent className={styles.sidenavContent} />
          </Sidenav>
        )}
        <main className={styles.main}>
          {!isTabletView && <Header />}
          {children}
        </main>
      </div>
    </MainRoutesProvider>
  );
};

export default MultipleSpacesLayout;
