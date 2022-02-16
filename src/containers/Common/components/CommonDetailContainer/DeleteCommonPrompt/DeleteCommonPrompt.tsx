import { deleteCommon } from "@/containers/Common/store/actions";
import { Button, ButtonVariant, Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string
}

export default function DeleteCommonPrompt({ isShowing, onClose, commonId }: IProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);

  const handleDelete = useCallback(() => {
    setDeleting(true);
    setError(undefined);
    dispatch(deleteCommon.request({
      payload: { commonId: commonId },
      callback: (error) => {
        if (error) {
          console.error(error);
          setDeleting(false);
          setError(error?.message ?? "Something went wrong :/");
          return;
        }
        // TODO: maybe need to show success notification for the user?
        history.push(ROUTE_PATHS.MY_COMMONS);
      }
    }));
  }, [dispatch, history, commonId]);

  return (
    <Modal isShowing={isShowing} onClose={onClose} className="delete-prompt-modal">
      <div className="delete-common-prompt-wrapper">
        <img src="/assets/images/delete-common-prompt.svg" alt="delete" />
        <h2>Are you sure?</h2>
        <p>If you delete this Common the data will be erased. You <b>can not</b> restore your Common once you delete it.</p>
        <Button
          disabled={deleting}
          variant={ButtonVariant.Secondary}
          onClick={handleDelete}
          className="delete-btn">
          {deleting ? "Deleting..." : "Delete Common"}
        </Button>
        <Button
          disabled={deleting}
          variant={ButtonVariant.Secondary}
          onClick={onClose}>
          Cancel
        </Button>
        {error && <span className="error-message">{error}</span>}
      </div>
    </Modal>
  )
}
