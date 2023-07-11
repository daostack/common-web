import React, { FC } from "react";
import { Modal } from "@/shared/components";
import { ModalType } from "@/shared/interfaces";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import styles from "./NoCommonsInfo.module.scss";

interface NoCommonsInfoProps {
  isOpen: boolean;
  onClose: () => void;
  onCommonCreate: () => void;
}

const NoCommonsInfo: FC<NoCommonsInfoProps> = (props) => {
  const { isOpen, onClose, onCommonCreate } = props;

  return (
    <Modal
      className={styles.modal}
      isShowing={isOpen}
      onClose={onClose}
      type={ModalType.MobilePopUp}
    >
      <p className={styles.text}>
        You do not have spaces yet. You might want to create a new common or ask
        your friends for the link to an existing one.
      </p>
      <Button
        className={styles.createCommonButton}
        variant={ButtonVariant.PrimaryPink}
        onClick={onCommonCreate}
      >
        Create common
      </Button>
    </Modal>
  );
};

export default NoCommonsInfo;
