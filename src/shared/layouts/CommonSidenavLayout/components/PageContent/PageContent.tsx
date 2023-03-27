import React, { cloneElement, FC, isValidElement, ReactNode } from "react";
import classNames from "classnames";
import { Loader, LoaderVariant } from "@/shared/ui-kit";
import styles from "./PageContent.module.scss";

interface FeedLayoutProps {
  className?: string;
  headerContent: ReactNode;
  isGlobalLoading?: boolean;
}

const PageContent: FC<FeedLayoutProps> = (props) => {
  const { className, headerContent, children, isGlobalLoading = false } = props;
  let headerEl: ReactNode = null;

  if (isValidElement(headerContent)) {
    headerEl = cloneElement(headerContent, {
      ...headerContent.props,
      className: classNames(styles.header, headerContent.props.className),
    });
  }

  return (
    <>
      {isGlobalLoading && (
        <Loader
          overlayClassName={styles.globalLoader}
          variant={LoaderVariant.Global}
        />
      )}
      <div className={classNames(styles.container, className)}>
        {headerEl}
        {children}
      </div>
    </>
  );
};

export default PageContent;
