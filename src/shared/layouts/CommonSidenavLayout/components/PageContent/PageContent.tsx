import React, { cloneElement, FC, isValidElement, ReactNode } from "react";
import classNames from "classnames";
import styles from "./PageContent.module.scss";

interface FeedLayoutProps {
  headerContent: ReactNode;
}

const PageContent: FC<FeedLayoutProps> = (props) => {
  const { headerContent, children } = props;
  let headerEl: ReactNode = null;

  if (isValidElement(headerContent)) {
    headerEl = cloneElement(headerContent, {
      ...headerContent.props,
      className: classNames(styles.header, headerContent.props.className),
    });
  }

  return (
    <div className={styles.container}>
      {headerEl}
      {children}
    </div>
  );
};

export default PageContent;
