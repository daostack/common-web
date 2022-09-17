import React, { FC, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectUser } from "@/containers/Auth/store/selectors";
import { leaveCommon } from "@/containers/Common/store/actions";
import { isRequestError } from "@/services/Api";
import { Loader, Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { useNotification } from "@/shared/hooks";
import { emptyFunction } from "@/shared/utils";
import { MainStep } from "./MainStep";
import "./index.scss";

interface DeleteUserModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  commonId: string;
}

const DeleteUserModal: FC<DeleteUserModalProps> = (props) => {
  const { isShowing, onClose, commonId } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isLoading = false;

  const handleUserDelete = useCallback(() => {
    if (!userId) {
      return;
    }

    setIsDeleting(true);
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

          setIsDeleting(false);
          setErrorText(errorText);

          if (isFinishedSuccessfully) {
            history.push(ROUTE_PATHS.MY_COMMONS);
            notify("You’ve successfully left the common");
          }
        },
      })
    );
  }, [dispatch, notify, history, commonId, userId]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={!isDeleting ? onClose : emptyFunction}
      hideCloseButton={isDeleting}
      title="Delete User"
      className="delete-user-modal"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <MainStep
          isLoading={isDeleting}
          errorText={errorText}
          onDelete={handleUserDelete}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
};

export default DeleteUserModal;
