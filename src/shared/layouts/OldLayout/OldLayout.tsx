import React, { FC } from "react";
import { useSelector } from "react-redux";
import {
  OldLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { getScreenSize } from "@/shared/store/selectors";
import { Footer } from "@/shared/ui-kit";
import { Content, Header } from "../../components";
import { checkFooterVisibility } from "./utils";
import styles from "./OldLayout.module.scss";

const OldLayout: FC = (props) => {
  const { children } = props;
  const currentScreenSize = useSelector(getScreenSize());
  const { routeOptions = {} } = useLayoutRouteContext<OldLayoutRouteOptions>();
  const isFooterVisible = checkFooterVisibility(
    routeOptions.footer,
    currentScreenSize,
  );

  return (
    <div className={styles.container}>
      <Header />
      <Content>{children}</Content>
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default OldLayout;
