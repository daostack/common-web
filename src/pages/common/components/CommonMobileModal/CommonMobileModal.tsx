import React, { FC } from "react";
import { Image, Modal } from "@/shared/components";
import { emptyFunction } from "@/shared/utils";
import styles from "./CommonMobileModal.module.scss";

interface CommonMobileModalProps {
  isOpen: boolean;
  isClosingEnabled?: boolean;
  onClose: () => void;
  commonImage: string;
  commonName: string;
}

const CommonMobileModal: FC<CommonMobileModalProps> = (props) => {
  const {
    isOpen,
    isClosingEnabled = true,
    onClose,
    commonImage,
    commonName,
    children,
  } = props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={isClosingEnabled ? onClose : emptyFunction}
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
      hideCloseButton={!isClosingEnabled}
      styles={{
        headerWrapper: styles.modalHeaderWrapper,
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      {children}
    </Modal>
  );
};

export default CommonMobileModal;
