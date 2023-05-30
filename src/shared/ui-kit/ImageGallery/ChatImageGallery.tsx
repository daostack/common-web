import React, { FC } from "react";
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
  const images = (gallery || []).map(({ value }) => value);

  const [leftImage, rightImage, secondRowLeftImage, secondRowRightImage] =
    images;

  const hasOneImage = Boolean(leftImage && !rightImage);
  const singleImageWithoutVideo = hasOneImage && !videoSrc;
  const shouldShowImageCountButton = images.length > 4;

  if (images.length === 0 && !videoSrc) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div
        className={classNames({
          [styles.content]: hasOneImage,
        })}
        onClick={onOpen}
      >
        {!secondRowRightImage && (
          <div className={styles.mainContentContainer}>
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
                [styles.leftItem]: !hasOneImage,
                [styles.singleImage]: singleImageWithoutVideo,
              })}
              src={leftImage}
              imageOverlay={styles.imageOverlay}
              alt="1st Image"
            />
          )}
          {rightImage && (
            <Image
              className={classNames(styles.image, styles.rightItem)}
              src={rightImage}
              imageOverlay={styles.imageOverlay}
              alt="2nd Image"
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
              className={classNames(styles.image, {
                [styles.leftItem]: !hasOneImage,
                [styles.singleImage]: singleImageWithoutVideo,
              })}
              imageOverlay={styles.imageOverlay}
              src={secondRowLeftImage}
              alt="3st Image"
            />
            <Image
              className={classNames(styles.image, styles.rightItem)}
              src={secondRowRightImage}
              imageOverlay={styles.imageOverlay}
              alt="4nd Image"
            />
          </div>
        )}
      </div>
      {shouldShowImageCountButton && (
        <Button className={styles.imageCountButton} onClick={onOpen}>
          <p className={styles.imageCountButtonText}>8 Pic</p>
        </Button>
      )}
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

export default ChatImageGallery;
