import React, { FC } from "react";
import { Content, Footer, Header } from "../../components";
import styles from "./OldLayout.module.scss";

const OldLayout: FC = (props) => {
  const { children } = props;

  return (
    <div className={styles.container}>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
};

export default OldLayout;
