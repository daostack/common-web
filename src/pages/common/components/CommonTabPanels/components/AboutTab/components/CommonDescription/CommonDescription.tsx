import React, { FC, useMemo } from "react";
import classNames from "classnames";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useFullText } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import {
  Container,
  Tags,
  ImageGallery,
  parseStringToTextEditorValue,
  checkIsTextEditorValueEmpty,
  TextEditor,
} from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import { CommonLinks } from "../CommonLinks";
import styles from "./CommonDescription.module.scss";

interface CommonDescriptionProps {
  common: Common;
}

const CommonDescription: FC<CommonDescriptionProps> = (props) => {
  const { common } = props;
  const tags = common.tags || [];
  const isTabletView = useIsTabletView();
  const {
    setRef: setDescriptionRef,
    shouldShowFullText,
    isFullTextShowing,
    toggleFullText,
  } = useFullText<HTMLElement>();
  const parsedDescription = useMemo(
    () => parseStringToTextEditorValue(common.description),
    [common.description],
  );
  const isDescriptionEmpty = checkIsTextEditorValueEmpty(parsedDescription);
  const shouldDisplaySeeMoreButton =
    (shouldShowFullText || !isFullTextShowing) && !isDescriptionEmpty;

  const isFullyEmpty =
    isDescriptionEmpty &&
    tags.length === 0 &&
    !common.video &&
    (!common.gallery || common.gallery.length === 0) &&
    common.links.length === 0;

  if (isFullyEmpty) {
    return null;
  }

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard className={styles.container} hideCardStyles={isTabletView}>
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
        {shouldDisplaySeeMoreButton && (
          <a className={styles.seeMore} onClick={toggleFullText}>
            See {shouldShowFullText ? "less" : "more"}
          </a>
        )}
        {tags.length > 0 && (
          <div className={styles.tagsWrapper}>
            <Tags tags={tags} />
          </div>
        )}
        <ImageGallery gallery={common.gallery} videoSrc={common.video?.value} />
        <CommonLinks className={styles.commonLinks} links={common.links} />
      </CommonCard>
    </Container>
  );
};

export default CommonDescription;
