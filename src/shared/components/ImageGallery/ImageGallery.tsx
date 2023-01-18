import React, { FC, LegacyRef, useMemo, useRef, useState } from "react";
import { useMeasure } from "react-use";
import { ButtonLink, Image } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonLink } from "@/shared/models";
import { ImageGalleryModal, ImageGalleryMobileModal } from "./components";
import styles from "./ImageGallery.module.scss";

interface ImageGalleryProps {
  gallery: CommonLink[];
  videoSrc?: string;
}

const ImageGallery: FC<ImageGalleryProps> = (props) => {
  const { gallery, videoSrc } = props;
  const videoRef = useRef<HTMLVideoElement>();
  const isTabletView = useIsTabletView();
  const [videoContainerRef, { width: videoContainerWidth }] = useMeasure();
  const { isShowing, onOpen, onClose } = useModal(false);
  const images = (gallery || []).map(({ value }) => value);

  const [isPlaying, setIsPlaying] = useState(false);
  const [leftImage, rightImage] = images;

  const handleClickPlayButton = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const imagePreviewStyle = useMemo(
    () => ({
      height: `calc(${videoContainerWidth / 2}px - 0.875rem)`,
      width: `calc(${videoContainerWidth / 2}px - 0.15625rem)`,
    }),
    [videoContainerWidth],
  );

  if (images.length === 0 && !videoSrc) {
    return null;
  }

  return (
    <div
      ref={videoContainerRef as LegacyRef<HTMLDivElement>}
      className={styles.container}
    >
      <div className={styles.videoContainer}>
        {videoSrc && (
          <>
            <video
              ref={videoRef as LegacyRef<HTMLVideoElement>}
              className={styles.video}
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
        )}
      </div>
      <div className={styles.imageContainer}>
        {leftImage && (
          <Image
            className={styles.imageLeft}
            style={imagePreviewStyle}
            src={leftImage}
            alt="image"
          />
        )}
        {rightImage && (
          <Image
            className={styles.imageRight}
            style={imagePreviewStyle}
            src={rightImage}
            alt="image"
          />
        )}
      </div>
      <ButtonLink
        className={styles.seeAllGallery}
        onClick={() => {
          onOpen();
        }}
      >
        Sell all gallery
      </ButtonLink>
      {isTabletView ? (
        <ImageGalleryMobileModal
          images={images}
          isShowing={isShowing}
          onClose={onClose}
        />
      ) : (
        <ImageGalleryModal
          isShowing={isShowing}
          onClose={onClose}
          images={images}
        />
      )}
    </div>
  );
};

export default ImageGallery;
