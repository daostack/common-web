import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { leaveCommon } from "@/containers/Common/store/actions";
import { Button, ButtonVariant, Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { useNotification } from "@/shared/hooks";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string
}

export default function LeaveCommonPrompt({ isShowing, onClose, commonId }: IProps) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

  const handleLeave = useCallback(() => {
    setLeaving(true);
    setError("");
    dispatch(leaveCommon.request({
      payload: { commonId },
      callback: (error) => {
        if (error) {
          console.error(error);
          setLeaving(false);
          setError(error?.message ?? "Something went wrong :/");
          return;
        }
        history.push(ROUTE_PATHS.MY_COMMONS);
        notify("You've successfully left the common");
      }
    }));
  }, [dispatch, notify, history, commonId]);

  return (
    <Modal isShowing={isShowing} onClose={onClose} className="leave-prompt-modal">
      <div className="leave-common-prompt-wrapper">
        <img src="/assets/images/delete-common-prompt.svg" alt="delete" />
        <h2>Are you sure you want to leave this common?</h2>
        <p>By leaving the common you will loose your role and voting power. No more contributions will be charged</p>
        <Button
          disabled={leaving}
          variant={ButtonVariant.Secondary}
          onClick={handleLeave}
          className="leave-btn">
          {leaving ? "Leaving..." : "Leave Common"}
        </Button>
        <Button
          disabled={leaving}
          variant={ButtonVariant.Secondary}
          onClick={onClose}>
          Cancel
        </Button>
        {error && <span className="error-message">{error}</span>}
      </div>
    </Modal>
  )
}
