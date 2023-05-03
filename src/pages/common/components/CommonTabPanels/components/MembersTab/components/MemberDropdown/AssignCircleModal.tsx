import React, { useCallback, useState } from "react";
import { CommonService } from "@/services";
import { Button, ButtonVariant, Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { SelectedCircle } from "./MemberDropdown";
import styles from "./AssignCircleModal.module.scss";

interface AssignCircleModalProps {
  isShowing: boolean;
  onClose: () => void;
  onMenuToggle: (isOpen: boolean) => void;
  memberName: string;
  selectedCircle?: SelectedCircle;
}
export default function AssignCircleModal({
  isShowing,
  onClose,
  onMenuToggle,
  selectedCircle,
  memberName,
}: AssignCircleModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleAdd = async () => {
    if (!selectedCircle) return;

    try {
      setIsAdding(true);
      setErrorText("");

      await CommonService.inviteToCircle(selectedCircle.id);

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
    >
      <div className={styles.content}>
        <h3>
          Add {memberName} to {selectedCircle?.name}?
        </h3>
        <div>
          <Button onClick={handleAdd} disabled={isAdding}>
            Add
          </Button>
          <Button
            variant={ButtonVariant.Secondary}
            onClick={handleClose}
            disabled={isAdding}
          >
            Cancel
          </Button>
        </div>
        {errorText && (
          <ErrorText className={styles.error}>{errorText}</ErrorText>
        )}
      </div>
    </Modal>
  );
}
