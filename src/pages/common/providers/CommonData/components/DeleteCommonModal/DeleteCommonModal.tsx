import React, { FC, useState } from "react";
import { CommonMemberEventEmitter } from "@/events";
import { CommonService } from "@/services";
import { Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import styles from "./DeleteCommonModal.module.scss";

interface DeleteCommonModalProps {
  commonId: string;
  commonName: string;
  isSpace: boolean;
  isShowing: boolean;
  onClose: () => void;
}

const DeleteCommonModal: FC<DeleteCommonModalProps> = (props) => {
  const { isShowing, onClose, commonName, isSpace, commonId } = props;
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const entityType = isSpace ? "space" : "common";

  const handleLeave = async () => {
    setIsDeleting(true);
    setErrorText("");

    try {
      await CommonService.deleteCommon(commonId);
      // CommonMemberEventEmitter.emit(
      //   CommonMemberEvent.Reset,
      //   commonId,
      //   commonMemberId,
      // );
      setIsDeleting(false);
      onClose();
    } catch (error) {
      setErrorText("Something went wrong");
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      className={styles.modal}
      title={`Delete ${commonName} ${entityType}`}
      isShowing={isShowing}
      onClose={isDeleting ? emptyFunction : onClose}
    >
      <div>
        Deleting a {entityType} is irreversible and will delete all of its
        content. Are you sure you want to continue?
        <div className={styles.buttonsWrapper}>
          <Button
            variant={ButtonVariant.OutlineDarkPink}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            className={styles.deleteButton}
            variant={ButtonVariant.PrimaryPink}
            onClick={handleLeave}
            disabled={isDeleting}
          >
            Delete {entityType}
          </Button>
        </div>
        {errorText && (
          <ErrorText className={styles.error}>{errorText}</ErrorText>
        )}
      </div>
    </Modal>
  );
};

export default DeleteCommonModal;
