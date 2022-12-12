import React, { FC } from "react";
import {
  OldLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { Footer } from "@/shared/ui-kit";
import { Content, Header } from "../../components";
import styles from "./OldLayout.module.scss";

const OldLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } = useLayoutRouteContext<OldLayoutRouteOptions>();
  const shouldDisplayFooter = routeOptions.footer ?? true;

  return (
    <div className={styles.container}>
      <Header />
      <Content>{children}</Content>
      {shouldDisplayFooter && <Footer />}
    </div>
  );
};

export default OldLayout;
