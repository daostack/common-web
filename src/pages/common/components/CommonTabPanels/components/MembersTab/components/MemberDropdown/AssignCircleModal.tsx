import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonService } from "@/services";
import { Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { Circle } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { pluralizeWord } from "@/shared/utils";
import { commonActions } from "@/store/states";
import styles from "./AssignCircleModal.module.scss";

interface AssignCircleModalProps {
  isShowing: boolean;
  onClose: () => void;
  memberName: string;
  selectedCircle?: Circle;
  commonId: string;
  memberId: string;
  isProject: boolean;
}
export default function AssignCircleModal({
  isShowing,
  onClose,
  selectedCircle,
  memberName,
  commonId,
  memberId,
  isProject,
}: AssignCircleModalProps) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleAdd = async () => {
    if (!selectedCircle) return;

    try {
      setIsAdding(true);
      setErrorText("");

      await CommonService.inviteToCircle(selectedCircle.id, commonId, memberId);
      dispatch(
        commonActions.setRecentAssignedCircleByMember({
          memberId,
          circle: selectedCircle,
          commonId,
        }),
      );

      handleClose();
    } catch (error) {
      setErrorText("Something went wrong...");
      setIsAdding(false);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={handleClose}
      hideCloseButton={isAdding}
      className={styles.modal}
      title={`Add ${memberName} to ${pluralizeWord(selectedCircle?.name)}?`}
    >
      <div className={styles.content}>
        <div className={styles.text}>
          The action will grant {memberName} access to private discussions and
          additional permissions in this {isProject ? "space" : "common"}.
        </div>
        <div className={styles.buttonsContainer}>
          <Button
            variant={ButtonVariant.OutlineDarkPink}
            onClick={handleClose}
            disabled={isAdding}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.PrimaryPink}
            onClick={handleAdd}
            disabled={isAdding}
          >
            Confirm
          </Button>
        </div>
        {errorText && (
          <ErrorText className={styles.error}>{errorText}</ErrorText>
        )}
      </div>
    </Modal>
  );
}
