import React from "react";
import classNames from "classnames";
import { useFullText } from "@/shared/hooks";
import styles from "./FeedGeneralInfo.module.scss";

interface FeedGeneralInfoProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export const FeedGeneralInfo: React.FC<FeedGeneralInfoProps> = (props) => {
  const { title, subtitle, description } = props;
  const {
    ref: descriptionRef,
    shouldShowFullText,
    isFullTextShowing,
    toggleFullText,
  } = useFullText();

  return (
    <div className={styles.container}>
      {title && (
        <p className={classNames(styles.text, styles.title)}>{title}</p>
      )}
      {subtitle && (
        <p className={classNames(styles.text, styles.subtitle)}>{subtitle}</p>
      )}
      {description && (
        <>
          <p
            ref={descriptionRef}
            className={classNames(styles.text, styles.description, {
              [styles.descriptionShortened]: !shouldShowFullText,
            })}
          >
            {description}
          </p>
          {(shouldShowFullText || !isFullTextShowing) && (
            <a
              className={classNames(styles.seeMore, styles.text)}
              onClick={toggleFullText}
            >
              See {shouldShowFullText ? "less" : "more"}
            </a>
          )}
        </>
      )}
    </div>
  );
};
