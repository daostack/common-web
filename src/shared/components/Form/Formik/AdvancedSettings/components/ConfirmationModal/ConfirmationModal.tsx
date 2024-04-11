import React, { FC, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { GovernanceService, Logger } from "@/services";
import { Modal } from "@/shared/components/Modal";
import { IntermediateCreateProjectPayload } from "@/shared/interfaces";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { CircleChange } from "./types";
import { generateCircleChanges, generatePreviewPayload } from "./utils";
import styles from "./ConfirmationModal.module.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  governanceId?: string | null;
}

const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
  const { isOpen, onClose, governanceId } = props;
  const {
    values: { advancedSettings },
  } = useFormikContext<IntermediateCreateProjectPayload>();
  const [isUpdatePreviewLoading, setIsUpdatePreviewLoading] = useState(true);
  const [circleChanges, setCircleChanges] = useState<CircleChange[]>([]);
  const isLoading = isUpdatePreviewLoading;

  useEffect(() => {
    const { permissionGovernanceId, circles } = advancedSettings || {};

    if (!isOpen || !governanceId || !permissionGovernanceId || !circles) {
      setIsUpdatePreviewLoading(true);
      setCircleChanges([]);
      return;
    }

    (async () => {
      try {
        const data = await GovernanceService.previewCirclesUpdate(
          generatePreviewPayload(governanceId, permissionGovernanceId, circles),
        );
        const circleChanges = await generateCircleChanges(data);
        setCircleChanges(circleChanges);
        setIsUpdatePreviewLoading(false);
      } catch (err) {
        Logger.error(err);
      }
    })();
  }, [isOpen]);

  return (
    <Modal
      className={styles.modal}
      title="Are you sure?"
      isShowing={isOpen}
      onClose={isLoading ? emptyFunction : onClose}
      hideCloseButton={isLoading}
      styles={{
        header: styles.modalHeader,
        content: styles.modalContent,
      }}
    >
      {isLoading && <Loader className={styles.loader} />}
      {!isLoading && (
        <>
          <span>
            Notice that this action will change the roles for some users:
          </span>
          <ul className={styles.changesList}>
            {circleChanges.map((circleChange) => (
              <li>
                {circleChange.userName} will be{" "}
                {circleChange.added ? "added to" : "removed from"}{" "}
                {circleChange.circleName}
              </li>
            ))}
          </ul>
          <div className={styles.buttonsWrapper}>
            <Button variant={ButtonVariant.PrimaryGray} onClick={onClose}>
              Cancel
            </Button>
            <Button variant={ButtonVariant.PrimaryPink}>Apply</Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConfirmationModal;