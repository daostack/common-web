import React, { FC } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { VideoEmbed } from "@/shared/ui-kit/VideoEmbed";
import styles from "./GalleryMainContent.module.scss";

interface GalleryMainContentProps {
  videoSrc?: string;
  mainImage: string;
  srcSet?: string;
  hasOneImage: boolean;
  imagePreviewStyle?: React.CSSProperties;
}

const GalleryMainContent: FC<GalleryMainContentProps> = (props) => {
  const { mainImage, srcSet, videoSrc, hasOneImage, imagePreviewStyle } = props;

  if (!videoSrc && !mainImage) {
    return null;
  }

  if (videoSrc) {
    return (
      <VideoEmbed
        videoSrc={videoSrc}
        className={classNames(styles.mainContent, {
          [styles.leftItem]: hasOneImage,
        })}
        style={imagePreviewStyle}
      />
    );
  }

  return (
    <Image
      className={styles.mainContent}
      src={mainImage}
      srcSet={srcSet}
      imageContainerClassName={styles.imageContainer}
      imageOverlayClassName={styles.imageOverlay}
      alt="3rd Image"
    />
  );
};

export default GalleryMainContent;
