import React, { ReactNode, useMemo } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { useFullText } from "@/shared/hooks";
import { AttachIcon } from "@/shared/icons";
import { CommonLink } from "@/shared/models";
import {
  checkIsTextEditorValueEmpty,
  parseStringToTextEditorValue,
  TextEditor,
} from "@/shared/ui-kit";
import styles from "./FeedGeneralInfo.module.scss";

interface FeedGeneralInfoProps {
  title?: string;
  subtitle?: ReactNode;
  description?: string;
  images?: CommonLink[];
}

export const FeedGeneralInfo: React.FC<FeedGeneralInfoProps> = (props) => {
  const { title, subtitle, description, images = [] } = props;
  const {
    setRef: setDescriptionRef,
    shouldShowFullText,
    isFullTextShowing,
    toggleFullText,
  } = useFullText<HTMLElement>();
  const parsedDescription = useMemo(
    () => parseStringToTextEditorValue(description),
    [description],
  );
  const isDescriptionEmpty = checkIsTextEditorValueEmpty(parsedDescription);
  const image = images[0];
  const shouldDisplaySeeMoreButton =
    ((shouldShowFullText || !isFullTextShowing) && !isDescriptionEmpty) ||
    images.length > 0;

  const handleSeeMoreClick = () => {
    toggleFullText();
  };

  return (
    <div className={styles.container}>
      {title && (
        <p className={classNames(styles.text, styles.title)}>{title}</p>
      )}
      {subtitle && (
        <p className={classNames(styles.text, styles.subtitle)}>{subtitle}</p>
      )}
      {!isDescriptionEmpty && (
        <TextEditor
          editorRef={setDescriptionRef}
          editorClassName={classNames(styles.description, {
            [styles.descriptionShortened]: !shouldShowFullText,
          })}
          value={parsedDescription}
          readOnly
        />
      )}
      {image && shouldShowFullText && (
        <Image
          src={image.value}
          className={classNames(styles.image)}
          alt={image.title}
        />
      )}
      {shouldDisplaySeeMoreButton && (
        <a
          className={classNames(styles.seeMore, styles.text)}
          onClick={handleSeeMoreClick}
        >
          See{" "}
          {shouldShowFullText ? (
            "less"
          ) : (
            <>
              more
              {images.length > 0 && (
                <AttachIcon className={styles.attachIcon} />
              )}
            </>
          )}
        </a>
      )}
    </div>
  );
};
