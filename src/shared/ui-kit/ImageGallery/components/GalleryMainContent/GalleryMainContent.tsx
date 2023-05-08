import React, { FC, LegacyRef, useCallback, useRef, useState } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import styles from "./GalleryMainContent.module.scss";

interface GalleryMainContentProps {
  videoSrc?: string;
  mainImage: string;
  hasOneImage: boolean;
  imagePreviewStyle?: React.CSSProperties;
}

const GalleryMainContent: FC<GalleryMainContentProps> = (props) => {
  const { mainImage, videoSrc, hasOneImage, imagePreviewStyle } = props;
  const videoRef = useRef<HTMLVideoElement>();

  const [isPlaying, setIsPlaying] = useState(false);

  const handleClickPlayButton = useCallback(() => {
    setIsPlaying(true);
    videoRef.current?.play();
  }, []);

  if (!videoSrc && !mainImage) {
    return null;
  }

  if (videoSrc) {
    return (
      <>
        <video
          ref={videoRef as LegacyRef<HTMLVideoElement>}
          className={classNames(styles.mainContent, {
            [styles.leftItem]: hasOneImage,
          })}
          style={hasOneImage && imagePreviewStyle ? imagePreviewStyle : {}}
          playsInline
          preload="auto"
          controls={isPlaying}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {!isPlaying && (
          <div
            onClick={handleClickPlayButton}
            className={styles.playButtonContainer}
          >
            <img
              className={styles.playButton}
              src="/icons/play-button.svg"
              alt="play-button"
            />
          </div>
        )}
      </>
    );
  }

  return (
    <Image className={styles.mainContent} src={mainImage} alt="3rd Image" />
  );
};

export default GalleryMainContent;
