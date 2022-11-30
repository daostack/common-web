import React, { FC } from "react";
import classNames from "classnames";
import {
  SidenavLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { useAllViews } from "@/shared/hooks/viewport";
import { Footer, Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "./components";
import { checkFooterVisibility } from "./utils";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<SidenavLayoutRouteOptions>();
  const viewportStates = useAllViews();
  const isFooterVisible = checkFooterVisibility(
    routeOptions.footer,
    viewportStates,
  );

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerWithoutFooter]: !isFooterVisible,
      })}
    >
      <Sidenav>
        <SidenavContent className={styles.sidenavContent} />
      </Sidenav>
      <main className={styles.main}>{children}</main>
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default SidenavLayout;
