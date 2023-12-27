import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CommonService } from "@/services";
import { Modal } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { useNotification } from "@/shared/hooks";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { getCommonPagePath, getInboxPagePath } from "@/shared/utils";
import styles from "./DeleteCommonModal.module.scss";

interface DeleteCommonModalProps {
  commonId: string;
  commonName: string;
  isSpace: boolean;
  isShowing: boolean;
  onClose: () => void;
  parentCommonId?: string;
}

const DeleteCommonModal: FC<DeleteCommonModalProps> = (props) => {
  const history = useHistory();
  const { notify } = useNotification();
  const { isShowing, onClose, commonName, isSpace, commonId, parentCommonId } =
    props;
  const [isDeleting, setIsDeleting] = useState(false);
  const user = useSelector(selectUser());
  const [errorText, setErrorText] = useState("");
  const entityType = isSpace ? "space" : "common";

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorText("");

    try {
      if (!user?.uid) {
        return;
      }
      await CommonService.deleteCommon(commonId, user?.uid);
      CommonEventEmitter.emit(CommonEvent.CommonDeleted, commonId);

      notify(`${commonName} has been successfully deleted`);
      setIsDeleting(false);
      onClose();

      if (parentCommonId) {
        history.push(getCommonPagePath(parentCommonId));
      } else {
        history.push(getInboxPagePath());
      }
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
      onClose={onClose}
      hideCloseButton
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
            variant={ButtonVariant.Warning}
            onClick={handleDelete}
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
