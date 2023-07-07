import React, { FC } from "react";
import { Modal } from "@/shared/components";
import { ModalType } from "@/shared/interfaces";
import styles from "./MenuPopUp.module.scss";

interface MenuPopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuPopUp: FC<MenuPopUpProps> = (props) => {
  const { isOpen, onClose, children } = props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      type={ModalType.MobilePopUp}
      withoutHeader
      withoutHorizontalPadding
      hideCloseButton
      styles={{
        modalOverlay: styles.modalOverlay,
      }}
    >
      {children}
    </Modal>
  );
};

export default MenuPopUp;
