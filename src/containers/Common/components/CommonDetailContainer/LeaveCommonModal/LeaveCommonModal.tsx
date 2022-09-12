import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { leaveCommon } from "@/containers/Common/store/actions";
import { Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { useNotification } from "@/shared/hooks";
import { DeleteCommonRequest } from "./DeleteCommonRequest";
import "./index.scss";

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string;
}

export default function LeaveCommonModal({
  isShowing,
  onClose,
  commonId,
}: IProps) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");

  const handleLeave = useCallback(() => {
    setLeaving(true);
    setError("");
    dispatch(
      leaveCommon.request({
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
        },
      })
    );
  }, [dispatch, notify, history, commonId]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      title="Leave common"
      className="leave-common-modal"
    >
      <DeleteCommonRequest onOkClick={onClose} />
    </Modal>
  );
}
