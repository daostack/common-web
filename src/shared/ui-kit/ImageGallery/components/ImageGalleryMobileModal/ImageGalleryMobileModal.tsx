import React, { FC } from "react";
import { Image, Modal, ButtonIcon } from "@/shared/components";
import { Colors } from "@/shared/constants";
import { LongLeftArrowIcon } from "@/shared/icons";
import { emptyFunction } from "@/shared/utils";
import styles from "./ImageGalleryMobileModal.module.scss";

interface ImageGalleryMobileModalProps {
  images: string[];
  isShowing: boolean;
  onClose: () => void;
  videoSrc?: string;
}

const ImageGalleryMobileModal: FC<ImageGalleryMobileModalProps> = (props) => {
  const { isShowing, onClose, images, videoSrc } = props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isShowing}
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
      onClose={emptyFunction}
      hideCloseButton
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <ButtonIcon onClick={onClose}>
            <LongLeftArrowIcon
              className={styles.backButtonIcon}
              color={Colors.white}
            />
          </ButtonIcon>
        </div>
        <div className={styles.imageWrapper}>
          {videoSrc && (
            <div className={styles.videoContainer}>
              <video
                id="videoPlayer"
                className={styles.video}
                preload="auto"
                controls
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          )}
          {images.map((imageURL, index) => (
            <Image
              key={imageURL}
              className={styles.image}
              src={imageURL}
              alt={`Common gallery image #${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ImageGalleryMobileModal;
