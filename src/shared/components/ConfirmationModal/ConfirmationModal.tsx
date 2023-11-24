import React, { FC } from "react";
import { Modal } from "@/shared/components/Modal";
import { ModalProps } from "@/shared/interfaces";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import styles from "./ConfirmationModal.module.scss";

export interface ConfirmationModalState {
  isShowing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

interface ConfirmationModalProps
  extends ConfirmationModalState,
    Pick<ModalProps, "styles"> {
  title: string;
  closeText?: string;
  confirmText: string;
}

const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
  const {
    isShowing,
    styles: outerStyles,
    title,
    confirmText,
    closeText,
    onConfirm,
    onClose,
    children,
  } = props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isShowing}
      onClose={onClose}
      title={<h3 className={styles.modalTitle}>{title}</h3>}
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
        ...outerStyles,
      }}
    >
      <p className={styles.description}>{children}</p>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsWrapper}>
          {closeText && (
            <Button
              className={styles.button}
              variant={ButtonVariant.OutlineDarkPink}
              onClick={onClose}
            >
              {closeText}
            </Button>
          )}
          <Button
            className={styles.button}
            variant={ButtonVariant.PrimaryPink}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
