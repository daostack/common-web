import React, { FC } from "react";
import classNames from "classnames";
import { Modal } from "@/shared/components";
import { ModalType } from "@/shared/interfaces";
import styles from "./MenuPopUp.module.scss";

interface MenuPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  modalContentClassName?: string;
}

const MenuPopUp: FC<MenuPopUpProps> = (props) => {
  const { isOpen, onClose, modalContentClassName, children } = props;

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
        content: classNames(styles.modalContent, modalContentClassName),
      }}
    >
      {children}
    </Modal>
  );
};

export default MenuPopUp;
