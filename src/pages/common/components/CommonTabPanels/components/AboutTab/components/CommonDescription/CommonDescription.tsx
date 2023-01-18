import React, { FC } from "react";
import classNames from "classnames";
import { ImageGallery, Linkify } from "@/shared/components";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useFullText } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import { Container, Tags } from "@/shared/ui-kit";
import { isRTL } from "@/shared/utils";
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
    ref: descriptionRef,
    shouldShowFullText,
    isFullTextShowing,
    toggleFullText,
  } = useFullText();

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard className={styles.container} hideCardStyles={isTabletView}>
        <p
          ref={descriptionRef}
          className={classNames(styles.description, {
            [styles.descriptionRTL]: isRTL(common.description),
            [styles.descriptionShortened]: !shouldShowFullText,
          })}
        >
          <Linkify>{common.description}</Linkify>
        </p>
        {(shouldShowFullText || !isFullTextShowing) && (
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
