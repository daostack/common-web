import React, { FC, useState } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CommonLink } from "@/shared/models";
import { Button } from "../Button";
import {
  ImageGalleryModal,
  ImageGalleryMobileModal,
  GalleryMainContent,
} from "./components";
import styles from "./ChatImageGallery.module.scss";

interface ChatImageGalleryProps {
  gallery: CommonLink[];
  videoSrc?: string;
}

const ChatImageGallery: FC<ChatImageGalleryProps> = (props) => {
  const { gallery, videoSrc } = props;
  const isTabletView = useIsTabletView();
  const { isShowing, onOpen, onClose } = useModal(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const images = (gallery || []).map(({ value }) => value);

  const [leftImage, rightImage, secondRowLeftImage, secondRowRightImage] =
    images;

  const hasOneImage = Boolean(leftImage && !rightImage);
  const singleImageWithoutVideo = hasOneImage && !videoSrc;
  const shouldShowImageCountButton = images.length > 4;

  const handleOpenSlide = (slideNumber = 0) => {
    setInitialSlide(slideNumber);
    onOpen();
  };

  if (images.length === 0 && !videoSrc) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div
        className={classNames({
          [styles.content]: hasOneImage,
        })}
      >
        {!secondRowRightImage && (
          <div
            className={styles.mainContentContainer}
            onClick={() => handleOpenSlide(2)}
          >
            <GalleryMainContent
              videoSrc={videoSrc}
              mainImage={secondRowLeftImage}
              hasOneImage={hasOneImage}
            />
          </div>
        )}
        <div
          className={classNames(styles.imageContainer, {
            [styles.imageContainerSingleImage]: hasOneImage,
          })}
        >
          {leftImage && (
            <Image
              className={classNames(styles.image, {
                [styles.singleImage]: singleImageWithoutVideo,
              })}
              imageContainer={classNames({
                [styles.leftItem]: !hasOneImage,
              })}
              src={leftImage}
              imageOverlay={styles.imageOverlay}
              alt="1st Image"
              onClick={() => handleOpenSlide(0)}
            />
          )}
          {rightImage && (
            <Image
              className={styles.image}
              src={rightImage}
              imageContainer={styles.rightItem}
              imageOverlay={styles.imageOverlay}
              alt="2nd Image"
              onClick={() => handleOpenSlide(1)}
            />
          )}
        </div>
        {secondRowLeftImage && secondRowRightImage && (
          <div
            className={classNames(
              styles.imageContainer,
              styles.imageContainerSecondRow,
              {
                [styles.imageContainerSingleImage]: hasOneImage,
              },
            )}
          >
            <Image
              className={styles.image}
              imageContainer={classNames({
                [styles.leftImage]: !hasOneImage,
                [styles.singleImage]: singleImageWithoutVideo,
              })}
              imageOverlay={styles.imageOverlay}
              src={secondRowLeftImage}
              alt="3st Image"
              onClick={() => handleOpenSlide(2)}
            />
            <Image
              className={styles.image}
              imageContainer={styles.rightItem}
              src={secondRowRightImage}
              imageOverlay={styles.imageOverlay}
              alt="4nd Image"
              onClick={() => handleOpenSlide(3)}
            />
          </div>
        )}
      </div>
      {shouldShowImageCountButton && (
        <Button
          className={styles.imageCountButton}
          onClick={() => handleOpenSlide()}
        >
          <p className={styles.imageCountButtonText}>{images.length} Pic</p>
        </Button>
      )}
      {isTabletView ? (
        <ImageGalleryMobileModal
          images={images}
          isShowing={isShowing}
          onClose={onClose}
          videoSrc={videoSrc}
          initialSlide={initialSlide}
        />
      ) : (
        <ImageGalleryModal
          isShowing={isShowing}
          onClose={onClose}
          images={images}
          videoSrc={videoSrc}
          initialSlide={initialSlide}
        />
      )}
    </div>
  );
};

export default ChatImageGallery;
