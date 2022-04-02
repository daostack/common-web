import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { leaveCommon } from "@/containers/Common/store/actions";
import { Button, ButtonVariant, Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string
}

export default function LeaveCommonPrompt({ isShowing, onClose, commonId }: IProps) {
  const dispatch = useDispatch();
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
        // TODO: maybe need to show success notification for the user?
        history.push(ROUTE_PATHS.MY_COMMONS);
      }
    }));
  }, [dispatch, history, commonId]);

  return (
    <Modal isShowing={isShowing} onClose={onClose} className="leave-prompt-modal">
      <div className="leave-common-prompt-wrapper">
        {/* <img src="/assets/images/leave-common-prompt.svg" alt="leave" /> */}
        <span>LEAVE COMMON PICTURE</span>
        <h2>Are you sure you want to leave this common?</h2>
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
