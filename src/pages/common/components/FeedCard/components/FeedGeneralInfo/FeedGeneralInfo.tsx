import React, { ReactNode, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import classNames from "classnames";
import { useFullText } from "@/shared/hooks";
import { CommonLink } from "@/shared/models";
import {
  checkIsTextEditorValueEmpty,
  parseStringToTextEditorValue,
  ImageGallery,
  TextEditorWithReinitialization,
} from "@/shared/ui-kit";
import styles from "./FeedGeneralInfo.module.scss";

interface FeedGeneralInfoProps {
  subtitle?: ReactNode;
  description?: string;
  images?: CommonLink[];
}

export const FeedGeneralInfo: React.FC<FeedGeneralInfoProps> = (props) => {
  const { subtitle, description, images = [] } = props;
  const {
    setRef: setDescriptionRef,
    shouldShowFullText: shouldShowFullContent,
    isFullTextShowing,
    toggleFullText,
  } = useFullText<HTMLElement>();
  const parsedDescription = useMemo(
    () => parseStringToTextEditorValue(description),
    [description],
  );
  const isDescriptionEmpty = checkIsTextEditorValueEmpty(parsedDescription);
  const shouldDisplaySeeMoreButton =
    (shouldShowFullContent || !isFullTextShowing) && !isDescriptionEmpty;

  const handleSeeMoreClick = (event) => {
    event.stopPropagation();
    toggleFullText();
  };

  return (
    <div className={styles.container}>
      {subtitle && (
        <p className={classNames(styles.text, styles.subtitle)}>{subtitle}</p>
      )}
      {!isDescriptionEmpty && (
        <ErrorBoundary fallback={null}>
          <TextEditorWithReinitialization
            editorRef={setDescriptionRef}
            editorClassName={classNames(styles.description, {
              [styles.descriptionShortened]: !shouldShowFullContent,
              [styles.descriptionLessShortened]:
                !shouldShowFullContent && (!images || images.length === 0),
            })}
            value={parsedDescription}
            readOnly
          />
        </ErrorBoundary>
      )}
      {shouldDisplaySeeMoreButton && (
        <a
          className={classNames(styles.seeMore, styles.text)}
          onClick={handleSeeMoreClick}
        >
          See {shouldShowFullContent ? "less" : "more"}
        </a>
      )}
      {images.length > 0 && <ImageGallery gallery={images} />}
    </div>
  );
};
