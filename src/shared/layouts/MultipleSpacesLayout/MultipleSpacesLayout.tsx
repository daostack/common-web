import React, { CSSProperties, FC, useCallback } from "react";
import classNames from "classnames";
import { MainRoutesProvider } from "@/shared/contexts";
import { useLockedBody } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "../CommonSidenavLayout/components";
import styles from "./MultipleSpacesLayout.module.scss";

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const isTabletView = useIsTabletView();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const style = {
    "--sb-h-indent": "0px",
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
      <div
        className={classNames(styles.container, {
          [styles.containerWithSidenav]: isTabletView,
        })}
        style={style}
      >
        {isTabletView && (
          <Sidenav
            contentWrapperClassName={styles.sidenavContentWrapper}
            onOpenToggle={handleSidenavOpenToggle}
          >
            <SidenavContent className={styles.sidenavContent} />
          </Sidenav>
        )}
        <main className={styles.main}>{children}</main>
      </div>
    </MainRoutesProvider>
  );
};

export default MultipleSpacesLayout;
