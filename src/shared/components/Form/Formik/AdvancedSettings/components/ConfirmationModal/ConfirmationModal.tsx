import React, { FC, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { GovernanceService, Logger } from "@/services";
import { Checkbox } from "@/shared/components/Form";
import { Modal } from "@/shared/components/Modal";
import { useNotification } from "@/shared/hooks";
import { IntermediateCreateProjectPayload } from "@/shared/interfaces";
import { Circles } from "@/shared/models";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { ChangeItem } from "./components";
import { CommonCircleChange } from "./types";
import { generateCircleChanges, generatePreviewPayload } from "./utils";
import styles from "./ConfirmationModal.module.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  governanceId?: string | null;
  governanceCircles?: Circles;
}

const ConfirmationModal: FC<ConfirmationModalProps> = (props) => {
  const { isOpen, onClose, governanceId, governanceCircles } = props;
  const { notify } = useNotification();
  const {
    values: { advancedSettings },
  } = useFormikContext<IntermediateCreateProjectPayload>();
  const [isUpdatePreviewLoading, setIsUpdatePreviewLoading] = useState(true);
  const [isCirclesUpdateLoading, setIsCirclesUpdateLoading] = useState(false);
  const [isMovingForwardConfirmed, setIsMovingForwardConfirmed] =
    useState(false);
  const [commonCircleChanges, setCommonCircleChanges] = useState<
    CommonCircleChange[]
  >([]);
  const isLoading = isUpdatePreviewLoading || isCirclesUpdateLoading;

  const confirmChanges = async () => {
    const { permissionGovernanceId, circles } = advancedSettings || {};

    if (!governanceId || !permissionGovernanceId || !circles) {
      return;
    }

    try {
      setIsCirclesUpdateLoading(true);
      await GovernanceService.updateCircles(
        generatePreviewPayload(
          governanceId,
          permissionGovernanceId,
          circles,
          governanceCircles,
        ),
      );
      notify("Changes are successfully applied");
    } catch (err) {
      Logger.error(err);
    } finally {
      setIsCirclesUpdateLoading(false);
    }
  };

  const handleMovingForwardConfirm = () => {
    setIsMovingForwardConfirmed((v) => !v);
  };

  useEffect(() => {
    const { permissionGovernanceId, circles } = advancedSettings || {};

    if (!isOpen || !governanceId || !permissionGovernanceId || !circles) {
      setIsUpdatePreviewLoading(true);
      setCommonCircleChanges([]);
      return;
    }

    (async () => {
      try {
        const data = await GovernanceService.previewCirclesUpdate(
          generatePreviewPayload(
            governanceId,
            permissionGovernanceId,
            circles,
            governanceCircles,
          ),
        );
        const circleChanges = await generateCircleChanges(data);
        setCommonCircleChanges(circleChanges);
      } catch (err) {
        Logger.error(err);
      } finally {
        setIsUpdatePreviewLoading(false);
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
            {commonCircleChanges.map((commonCircleChange) => (
              <ChangeItem
                key={commonCircleChange.commonId}
                change={commonCircleChange}
              />
            ))}
          </ul>
          <Checkbox
            className={styles.confirmationCheckbox}
            name="confirmationMovingForward"
            label="Confirm moving forward with this roles change"
            checked={isMovingForwardConfirmed}
            onChange={handleMovingForwardConfirm}
          />
          <div className={styles.buttonsWrapper}>
            <Button variant={ButtonVariant.PrimaryGray} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.PrimaryPink}
              onClick={confirmChanges}
              disabled={!isMovingForwardConfirmed}
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ConfirmationModal;
