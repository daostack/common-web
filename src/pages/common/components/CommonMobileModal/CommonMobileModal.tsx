import React, { FC } from "react";
import { Image, Modal } from "@/shared/components";
import styles from "./CommonMobileModal.module.scss";

interface CommonMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  commonImage: string;
  commonName: string;
}

const CommonMobileModal: FC<CommonMobileModalProps> = (props) => {
  const { isOpen, onClose, commonImage, commonName, children } = props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      title={
        <div className={styles.titleWrapper}>
          <Image
            className={styles.commonImage}
            src={commonImage}
            alt={`${commonName}'s image`}
            placeholderElement={null}
            aria-hidden
          />
          <h3 className={styles.commonName}>{commonName}</h3>
        </div>
      }
      mobileFullScreen
      isHeaderSticky
      styles={{
        headerWrapper: styles.modalHeaderWrapper,
        header: styles.modalHeader,
      }}
    >
      {children}
    </Modal>
  );
};

export default CommonMobileModal;
