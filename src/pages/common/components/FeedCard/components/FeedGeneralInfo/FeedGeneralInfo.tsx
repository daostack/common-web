import React, { ReactNode, useMemo } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { useFullText } from "@/shared/hooks";
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
  image?: CommonLink;
}

export const FeedGeneralInfo: React.FC<FeedGeneralInfoProps> = (props) => {
  const { title, subtitle, description, image } = props;
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

  return (
    <div className={styles.container}>
      {title && (
        <p className={classNames(styles.text, styles.title)}>{title}</p>
      )}
      {subtitle && (
        <p className={classNames(styles.text, styles.subtitle)}>{subtitle}</p>
      )}
      {!checkIsTextEditorValueEmpty(parsedDescription) && (
        <>
          <TextEditor
            editorRef={setDescriptionRef}
            editorClassName={classNames(styles.description, {
              [styles.descriptionShortened]: !shouldShowFullText,
            })}
            value={parsedDescription}
            readOnly
          />
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
      {image && (
        <Image
          src={image.value}
          className={classNames(styles.image)}
          alt={image.title}
        />
      )}
    </div>
  );
};
