import React, { FC, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { Modal } from "@/shared/components/Modal";
import { IntermediateCreateProjectPayload } from "@/shared/interfaces";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import styles from "./ConfirmationModal.module.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
  const { isOpen, onClose } = props;
  const {
    values: { advancedSettings },
  } = useFormikContext<IntermediateCreateProjectPayload>();
  const [isUpdatePreviewLoading, setIsUpdatePreviewLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    (async () => {})();
  }, [isOpen]);

  return (
    <Modal
      className={styles.modal}
      title="Are you sure?"
      isShowing={isOpen}
      onClose={onClose}
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      {isUpdatePreviewLoading && <Loader className={styles.loader} />}
      {!isUpdatePreviewLoading && (
        <>
          <span>
            Notice that this action will change the roles for some users:
          </span>
          <div className={styles.buttonsWrapper}>
            <Button variant={ButtonVariant.PrimaryGray}>Cancel</Button>
            <Button variant={ButtonVariant.PrimaryPink}>Apply</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConfirmationModal;
