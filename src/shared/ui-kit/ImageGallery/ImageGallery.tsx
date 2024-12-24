import React, { FC, LegacyRef, useMemo } from "react";
import { useMeasure } from "react-use";
import classNames from "classnames";
import { ButtonLink, Image } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { CommonLink } from "@/shared/models";
import { FilePrefix, ResizeType, getResizedFileUrl } from "@/shared/utils";
import { ImageGalleryModal, GalleryMainContent } from "./components";
import styles from "./ImageGallery.module.scss";

interface ImageGalleryProps {
  gallery: CommonLink[];
  videoSrc?: string;
  useResizedFile?: boolean;
}

const ImageGallery: FC<ImageGalleryProps> = (props) => {
  const { gallery, videoSrc, useResizedFile = true } = props;
  const [videoContainerRef, { width: videoContainerWidth }] = useMeasure();
  const { isShowing, onOpen, onClose } = useModal(false);
  const images = (gallery || []).map(({ value }) => value);

  const imagesWithSrcSets = (gallery || []).map(({ value }) =>
    useResizedFile
      ? `${getResizedFileUrl(
          value,
          ResizeType.Images,
          FilePrefix.Image,
        )} 1x, ${value} 2x`
      : value,
  );

  const [leftImage, rightImage, mainImage] = images;
  const [leftImageSrcSet, rightImageSrcSet, mainImageSrcSet] =
    imagesWithSrcSets;

  const hasOneImage = Boolean(leftImage && !rightImage);
  const singleImageWithoutVideo = hasOneImage && !videoSrc;
  const canShowGalleryModal = [...images, videoSrc].filter(Boolean).length > 1;

  const imagePreviewStyle = useMemo(
    () => ({
      height: "9.375rem",
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
      <div
        className={classNames({
          [styles.content]: hasOneImage,
        })}
      >
        <div className={styles.mainContentContainer}>
          <GalleryMainContent
            videoSrc={videoSrc}
            mainImage={mainImage}
            srcSet={mainImageSrcSet}
            hasOneImage={hasOneImage}
            imagePreviewStyle={imagePreviewStyle}
          />
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
                [styles.singleImage]: singleImageWithoutVideo,
              })}
              style={singleImageWithoutVideo ? {} : imagePreviewStyle}
              src={leftImage}
              srcSet={leftImageSrcSet}
              alt="1st Image"
            />
          )}
          {rightImage && (
            <Image
              className={classNames(styles.image, styles.rightItem)}
              style={imagePreviewStyle}
              src={rightImage}
              srcSet={rightImageSrcSet}
              alt="2nd Image"
            />
          )}
        </div>
      </div>
      {canShowGalleryModal && (
        <ButtonLink className={styles.seeAllGallery} onClick={onOpen}>
          See all gallery
        </ButtonLink>
      )}

      <ImageGalleryModal
        isShowing={isShowing}
        onClose={onClose}
        images={images}
        videoSrc={videoSrc}
      />
    </div>
  );
};

export default ImageGallery;
