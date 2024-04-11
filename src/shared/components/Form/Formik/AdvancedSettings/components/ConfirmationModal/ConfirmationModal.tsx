import React, { FC, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { GovernanceService, Logger } from "@/services";
import { Modal } from "@/shared/components/Modal";
import {
  IntermediateCreateProjectPayload,
  PreviewCirclesUpdateCircles,
  PreviewCirclesUpdatePayload,
} from "@/shared/interfaces";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
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
  const isLoading = isUpdatePreviewLoading;

  useEffect(() => {
    const { permissionGovernanceId, circles } = advancedSettings || {};

    if (!isOpen || !governanceId || !permissionGovernanceId || !circles) {
      // TODO: Clear state
      setIsUpdatePreviewLoading(true);
      return;
    }

    (async () => {
      try {
        const circlesForPayload: PreviewCirclesUpdateCircles[] = circles
          .filter((circle) => circle.selected)
          .map((circle) => {
            if (!circle.circleId) {
              return null;
            }

            const { inheritFrom } = circle;

            return {
              type: "existing",
              circleId: circle.circleId,
              ...(circle.synced &&
                inheritFrom?.governanceId &&
                inheritFrom?.circleId && {
                  inheritFrom: {
                    governanceId: inheritFrom?.governanceId,
                    circleId: inheritFrom?.circleId,
                  },
                }),
            };
          })
          .filter((circle): circle is PreviewCirclesUpdateCircles =>
            Boolean(circle),
          );
        const payload: PreviewCirclesUpdatePayload = {
          governanceId,
          permissionGovernanceId,
          circles: circlesForPayload,
        };
        const data = await GovernanceService.previewCirclesUpdate(payload);
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
