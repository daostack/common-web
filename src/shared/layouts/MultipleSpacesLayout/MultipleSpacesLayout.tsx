import React, { CSSProperties, FC } from "react";
import { useSelector } from "react-redux";
import { useWindowSize } from "react-use";
import {
  useLayoutRouteContext,
  MultipleSpacesLayoutRouteOptions,
} from "@/pages/App/router";
import { MainRoutesProvider } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { selectMultipleSpacesLayoutBackUrl } from "@/store/states";
import { getSidenavLeft } from "../CommonSidenavLayout/utils";
import { Header, Menu } from "./components";
import styles from "./MultipleSpacesLayout.module.scss";

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<MultipleSpacesLayoutRouteOptions>();
  const backUrl = useSelector(selectMultipleSpacesLayoutBackUrl);
  const isTabletView = useIsTabletView();
  const { width } = useWindowSize();
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
  } as CSSProperties;

  return (
    <MainRoutesProvider>
      <div className={styles.container} style={style}>
        <Menu />
        <main className={styles.main}>
          {!isTabletView && (
            <Header
              backUrl={backUrl}
              withBreadcrumbs={routeOptions.withBreadcrumbs}
            />
          )}
          {children}
        </main>
      </div>
    </MainRoutesProvider>
  );
};

export default MultipleSpacesLayout;
