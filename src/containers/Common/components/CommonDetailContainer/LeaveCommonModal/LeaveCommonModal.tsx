import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUser } from "@/containers/Auth/store/selectors";
import { leaveCommon } from "@/containers/Common/store/actions";
import { isRequestError } from "@/services/Api";
import { Loader, Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { useNotification } from "@/shared/hooks";
import { useCommonMembersWithCircleIdsAmount } from "@/shared/hooks/useCases";
import { emptyFunction } from "@/shared/utils";
import { DeleteCommonRequest } from "./DeleteCommonRequest";
import { LastMemberInCircle } from "./LastMemberInCircle";
import { MainStep } from "./MainStep";
import "./index.scss";

interface LeaveCommonModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string;
  memberCount: number;
  memberCircleIds: string[];
}

const LeaveCommonModal: FC<LeaveCommonModalProps> = (props) => {
  const { isShowing, onClose, commonId, memberCount, memberCircleIds} = props;
  const {
    loading: areMemberAmountsLoading,
    fetched: areMemberAmountsFetched,
    data: memberAmountsWithCircleId,
    fetchCommonMembersWithCircleIdAmount,
  } = useCommonMembersWithCircleIdsAmount();
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [isLeaving, setIsLeaving] = useState(false);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDeleteCommonRequest = memberCount === 1;
  const isLoading = !isDeleteCommonRequest && !areMemberAmountsFetched;
  const isLastMemberInCircle = useMemo(
    () =>
      areMemberAmountsFetched &&
      memberAmountsWithCircleId.some(({ amount }) => amount <= 1),
    [areMemberAmountsFetched, memberAmountsWithCircleId]
  );

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
          setErrorText(errorText);

          if (isFinishedSuccessfully) {
            history.push(ROUTE_PATHS.MY_COMMONS);
            notify("You’ve successfully left the common");
          }
        },
      })
    );
  }, [dispatch, notify, history, commonId, userId]);

  useEffect(() => {
    if (
      isDeleteCommonRequest ||
      areMemberAmountsLoading ||
      areMemberAmountsFetched
    ) {
      return;
    }

    fetchCommonMembersWithCircleIdAmount(commonId, memberCircleIds);
  }, [
    isDeleteCommonRequest,
    areMemberAmountsLoading,
    areMemberAmountsFetched,
    fetchCommonMembersWithCircleIdAmount,
    commonId,
    memberCircleIds,
  ]);

  const renderStep = () => {
    if (isDeleteCommonRequest) {
      return <DeleteCommonRequest onOkClick={onClose} />;
    }
    if (isLastMemberInCircle) {
      return <LastMemberInCircle onOkClick={onClose} />;
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
      hideCloseButton={isLeaving}
      title="Leave common"
      className="leave-common-modal"
    >
      {isLoading ? <Loader /> : renderStep()}
    </Modal>
  );
};

export default LeaveCommonModal;
