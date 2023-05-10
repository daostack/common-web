import React, { FC } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { formatVideoSource, isYouTubeUrl } from "../../utils";
import styles from "./GalleryMainContent.module.scss";

interface GalleryMainContentProps {
  videoSrc?: string;
  mainImage: string;
  hasOneImage: boolean;
  imagePreviewStyle?: React.CSSProperties;
}

const GalleryMainContent: FC<GalleryMainContentProps> = (props) => {
  const { mainImage, videoSrc, hasOneImage, imagePreviewStyle } = props;

  if (!videoSrc && !mainImage) {
    return null;
  }

  if (videoSrc) {
    return (
      <>
        {isYouTubeUrl(videoSrc) ? (
          <iframe
            allowFullScreen
            className={classNames(styles.mainContent, {
              [styles.leftItem]: hasOneImage,
            })}
            style={hasOneImage && imagePreviewStyle ? imagePreviewStyle : {}}
            src={formatVideoSource(videoSrc)}
          ></iframe>
        ) : (
          <video
            className={classNames(styles.mainContent, {
              [styles.leftItem]: hasOneImage,
            })}
            style={hasOneImage && imagePreviewStyle ? imagePreviewStyle : {}}
            playsInline
            preload="auto"
            controls
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </>
    );
  }

  return (
    <Image className={styles.mainContent} src={mainImage} alt="3rd Image" />
  );
};

export default GalleryMainContent;
