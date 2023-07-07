import React, { CSSProperties, FC } from "react";
import { useWindowSize } from "react-use";
import { MainRoutesProvider } from "@/shared/contexts";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { getSidenavLeft } from "../CommonSidenavLayout/utils";
import { Header } from "./components";
import styles from "./MultipleSpacesLayout.module.scss";

const MultipleSpacesLayout: FC = (props) => {
  const { children } = props;
  const isTabletView = useIsTabletView();
  const { width } = useWindowSize();
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
  } as CSSProperties;

  return (
    <MainRoutesProvider>
      <div className={styles.container} style={style}>
        {isTabletView && <div>Sidenav</div>}
        <main className={styles.main}>
          {!isTabletView && <Header />}
          {children}
        </main>
      </div>
    </MainRoutesProvider>
  );
};

export default MultipleSpacesLayout;
