import React, { FC } from "react";
import { Image, Modal, ButtonIcon } from "@/shared/components";
import { Colors } from "@/shared/constants";
import { ArrowBackIcon } from "@/shared/icons";
import { emptyFunction } from "@/shared/utils";
import styles from "./ImageGalleryMobileModal.module.scss";

interface ImageGalleryMobileModalProps {
  images: string[];
  isShowing: boolean;
  onClose: () => void;
}

const ImageGalleryMobileModal: FC<ImageGalleryMobileModalProps> = (props) => {
  const { isShowing, onClose, images } = props;

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
            <ArrowBackIcon
              className={styles.backButtonIcon}
              color={Colors.white}
            />
          </ButtonIcon>
        </div>
        <div className={styles.imageWrapper}>
          {images.map((imageURL, index) => (
            <Image
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
