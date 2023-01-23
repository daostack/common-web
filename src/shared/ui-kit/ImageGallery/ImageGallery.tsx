import React, {
  FC,
  LegacyRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMeasure } from "react-use";
import classNames from "classnames";
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
  const [leftImage, rightImage, mainImage] = images;

  const hasOneImage = leftImage && !rightImage;
  const singleImageWithoutVideo = hasOneImage && !videoSrc;

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

  const MainContent = useCallback(() => {
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
            style={hasOneImage ? imagePreviewStyle : {}}
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
      <Image
        className={styles.mainContent}
        src={mainImage}
        alt="Gallery image"
      />
    );
  }, [
    videoSrc,
    mainImage,
    isPlaying,
    hasOneImage,
    imagePreviewStyle,
    handleClickPlayButton,
    videoRef,
  ]);

  if (images.length === 0 && !videoSrc) {
    return null;
  }

  return (
    <div
      ref={videoContainerRef as LegacyRef<HTMLDivElement>}
      className={styles.container}
    >
      <div
        className={classNames({
          [styles.content]: hasOneImage,
        })}
      >
        <div className={styles.mainContentContainer}>
          <MainContent />
        </div>
        <div
          className={classNames(styles.imageContainer, {
            [styles.imageContainerSingleImage]: hasOneImage,
          })}
        >
          {leftImage && (
            <Image
              className={classNames(styles.image, {
                [styles.leftItem]: !hasOneImage,
                [styles.rightItem]: hasOneImage,
                [styles.singleImage]: singleImageWithoutVideo,
              })}
              style={singleImageWithoutVideo ? {} : imagePreviewStyle}
              src={leftImage}
              alt="Open previous image"
            />
          )}
          {rightImage && (
            <Image
              className={classNames(styles.image, styles.rightItem)}
              style={imagePreviewStyle}
              src={rightImage}
              alt="Open next image"
            />
          )}
        </div>
      </div>
      <ButtonLink
        className={styles.seeAllGallery}
        onClick={() => {
          onOpen();
        }}
      >
        See all gallery
      </ButtonLink>
      {isTabletView ? (
        <ImageGalleryMobileModal
          images={images}
          isShowing={isShowing}
          onClose={onClose}
          videoSrc={videoSrc}
        />
      ) : (
        <ImageGalleryModal
          isShowing={isShowing}
          onClose={onClose}
          images={images}
          videoSrc={videoSrc}
        />
      )}
    </div>
  );
};

export default ImageGallery;
