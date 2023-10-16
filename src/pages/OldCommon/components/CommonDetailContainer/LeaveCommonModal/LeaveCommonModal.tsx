import React, { FC, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { leaveCommon } from "@/pages/OldCommon/store/actions";
import { isRequestError } from "@/services/Api";
import { Loader, Modal } from "@/shared/components";
import { ErrorCode, ROUTE_PATHS } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { ModalProps } from "@/shared/interfaces";
import { emptyFunction } from "@/shared/utils";
import { DeleteCommonRequest } from "./DeleteCommonRequest";
import { LastMemberInCircle } from "./LastMemberInCircle";
import { MainStep } from "./MainStep";
import "./index.scss";

interface LeaveCommonModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string;
  memberCount: number;
  onSuccessfulLeave?: () => void;
  isSubCommon?: boolean;
}

const LeaveCommonModal: FC<LeaveCommonModalProps> = (props) => {
  const {
    isShowing,
    onClose,
    commonId,
    memberCount,
    onSuccessfulLeave,
    isSubCommon = false,
  } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [isLeaving, setIsLeaving] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLastMemberInCircle, setIsLastMemberInCircle] = useState(false);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDeleteCommonRequest = memberCount === 1;
  const commonWord = isSubCommon ? "space" : "common";

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
          const errorText = error
            ? (isRequestError(error) && error.response?.data?.errorMessage) ||
              "Something went wrong"
            : "";

          setIsLeaving(false);
          setIsLastMemberInCircle(
            Boolean(
              isRequestError(error) &&
                error.response?.data?.error?.includes(
                  ErrorCode.LastInCriticalCircle,
                ),
            ),
          );
          setErrorText(errorText);

          if (!isFinishedSuccessfully) {
            return;
          }

          if (onSuccessfulLeave) {
            onSuccessfulLeave();
          } else {
            history.push(ROUTE_PATHS.MY_COMMONS);
            notify(`You’ve successfully left the ${commonWord}`);
          }
        },
      }),
    );
  }, [dispatch, notify, history, commonId, userId]);

  const renderStep = () => {
    if (isDeleteCommonRequest) {
      return (
        <DeleteCommonRequest onOkClick={onClose} isSubCommon={isSubCommon} />
      );
    }
    if (isLastMemberInCircle) {
      return (
        <LastMemberInCircle onOkClick={onClose} isSubCommon={isSubCommon} />
      );
    }

    return (
      <MainStep
        isLoading={isLeaving}
        errorText={errorText}
        onLeave={handleLeave}
        onCancel={onClose}
        isSubCommon={isSubCommon}
      />
    );
  };

  return (
    <Modal
      isShowing={isShowing}
      onClose={!isLeaving ? onClose : emptyFunction}
      hideCloseButton={isLeaving}
      title={`Leave ${commonWord}`}
      className="leave-common-modal"
    >
      {renderStep()}
    </Modal>
  );
};

export default LeaveCommonModal;
