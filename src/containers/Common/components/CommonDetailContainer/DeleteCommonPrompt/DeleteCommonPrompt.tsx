import { deleteCommon } from "@/containers/Common/store/actions";
import { Button, ButtonVariant, Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string
}

export default function DeleteCommonPrompt({ isShowing, onClose, commonId }: IProps) {
  const dispatch = useDispatch();

  const handleDelete = useCallback(
    async () => {
      dispatch(deleteCommon.request({ commonId: commonId }));
    },
    [dispatch, commonId]
  );

  return (
    <Modal isShowing={isShowing} onClose={onClose} className="delete-prompt-modal">
      <div className="delete-common-prompt-wrapper">
        <img src="assets/images/delete-common-prompt.svg" alt="delete" />
        <h2>Are you sure?</h2>
        <p>If you delete this Common the data will be erased. You <b>can not</b> restore your Common once you delete it.</p>
        <Button variant={ButtonVariant.Secondary} onClick={handleDelete} className="delete-btn">Delete Common</Button>
        <Button variant={ButtonVariant.Secondary} onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  )
}
