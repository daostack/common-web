import React, { FC, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUser } from "@/containers/Auth/store/selectors";
import { leaveCommon } from "@/containers/Common/store/actions";
import { Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { useNotification } from "@/shared/hooks";
import { emptyFunction } from "@/shared/utils";
import { DeleteCommonRequest } from "./DeleteCommonRequest";
import { MainStep } from "./MainStep";
import "./index.scss";

interface LeaveCommonModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string;
  memberCount: number;
}

const LeaveCommonModal: FC<LeaveCommonModalProps> = (props) => {
  const { isShowing, onClose, commonId, memberCount } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [isLeaving, setIsLeaving] = useState(false);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const handleLeave = useCallback(() => {
    if (!userId) {
      return;
    }

    setIsLeaving(true);
    setErrorText("");

    dispatch(
      leaveCommon.request({
        payload: {
          commonId,
          userId,
        },
        callback: (error) => {
          const isFinishedSuccessfully = !error;

          setIsLeaving(false);
          setErrorText(error ? error.message || "Something went wrong" : "");

          if (isFinishedSuccessfully) {
            history.push(ROUTE_PATHS.MY_COMMONS);
            notify("You’ve successfully left the common");
          }
        },
      })
    );
  }, [dispatch, notify, history, commonId, userId]);

  const renderStep = () => {
    if (memberCount === 1) {
      return <DeleteCommonRequest onOkClick={onClose} />;
    }

    return (
      <MainStep
        isLoading={isLeaving}
        errorText={errorText}
        onLeave={handleLeave}
        onCancel={onClose}
      />
    );
  };

  return (
    <Modal
      isShowing={isShowing}
      onClose={!isLeaving ? onClose : emptyFunction}
      title="Leave common"
      className="leave-common-modal"
    >
      {renderStep()}
    </Modal>
  );
};

export default LeaveCommonModal;
