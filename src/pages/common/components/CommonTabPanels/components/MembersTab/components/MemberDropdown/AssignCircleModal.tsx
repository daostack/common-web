import React, { useCallback, useState } from "react";
import { CommonService } from "@/services";
import { Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { SelectedCircle } from "./MemberDropdown";
import styles from "./AssignCircleModal.module.scss";

interface AssignCircleModalProps {
  isShowing: boolean;
  onClose: () => void;
  onMenuToggle: (isOpen: boolean) => void;
  memberName: string;
  selectedCircle?: SelectedCircle;
  commonId: string;
  memberId: string;
}
export default function AssignCircleModal({
  isShowing,
  onClose,
  onMenuToggle,
  selectedCircle,
  memberName,
  commonId,
  memberId,
}: AssignCircleModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleAdd = async () => {
    if (!selectedCircle) return;

    try {
      setIsAdding(true);
      setErrorText("");

      await CommonService.inviteToCircle(commonId, selectedCircle.id, memberId);

      handleClose();
    } catch (error) {
      setErrorText("Something went wrong");
      setIsAdding(false);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    onMenuToggle(false);
  }, [onClose, onMenuToggle]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={handleClose}
      hideCloseButton={isAdding}
      className={styles.modal}
    >
      <div className={styles.content}>
        <h3>
          Add {memberName} to {selectedCircle?.name}?
        </h3>
        <div className={styles.buttonsContainer}>
          <Button
            variant={ButtonVariant.Warning}
            onClick={handleClose}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.OutlineBlue}
            onClick={handleAdd}
            disabled={isAdding}
          >
            Yes
          </Button>
        </div>
        {errorText && (
          <ErrorText className={styles.error}>{errorText}</ErrorText>
        )}
      </div>
    </Modal>
  );
}
