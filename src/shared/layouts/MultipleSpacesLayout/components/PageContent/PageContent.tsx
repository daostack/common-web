import React, {
  cloneElement,
  CSSProperties,
  FC,
  isValidElement,
  ReactNode,
} from "react";
import classNames from "classnames";
import { Loader, LoaderVariant } from "@/shared/ui-kit";
import styles from "./PageContent.module.scss";

interface PageContentProps {
  className?: string;
  headerClassName?: string;
  headerContent: ReactNode;
  isGlobalLoading?: boolean;
  styles?: CSSProperties;
}

const PageContent: FC<PageContentProps> = (props) => {
  const {
    className,
    headerClassName,
    headerContent,
    children,
    isGlobalLoading = false,
    styles: pageContentStyles,
  } = props;
  let headerEl: ReactNode = null;

  if (headerContent && isValidElement(headerContent)) {
    headerEl = cloneElement(headerContent, {
      ...headerContent.props,
      className: classNames(
        styles.header,
        headerContent.props.className,
        headerClassName,
      ),
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
      <div
        className={classNames(
          styles.container,
          {
            [styles.containerWithHeader]: headerEl,
          },
          className,
        )}
        style={pageContentStyles}
      >
        {headerEl}
        {children}
      </div>
    </>
  );
};

export default PageContent;
