import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteUser } from "@/pages/Auth/store/actions";
import { selectUser } from "@/pages/Auth/store/selectors";
import { isRequestError } from "@/services/Api";
import { Loader, Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import { useUserInfoAboutMemberships } from "@/shared/hooks/useCases";
import { ModalProps } from "@/shared/interfaces";
import { emptyFunction } from "@/shared/utils";
import { MainStep } from "./MainStep";
import { parseErrorsByCommonId } from "./helpers";
import { DeleteError, ErrorsByCommonId } from "./types";
import "./index.scss";

type DeleteUserModalProps = Pick<ModalProps, "isShowing" | "onClose">;

const DeleteUserModal: FC<DeleteUserModalProps> = (props) => {
  const { isShowing, onClose } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<DeleteError[]>([]);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const {
    loading: isUserInfoAboutMembershipsLoading,
    fetched: isUserInfoAboutMembershipsFetched,
    data: userInfoAboutMembershipsFetched,
    fetchUserInfoAboutMemberships,
  } = useUserInfoAboutMemberships();
  const userId = user?.uid;
  const isLoading = isUserInfoAboutMembershipsLoading;

  useEffect(() => {
    if (
      !isUserInfoAboutMembershipsLoading &&
      !isUserInfoAboutMembershipsFetched
    ) {
      fetchUserInfoAboutMemberships();
    }
  }, [
    isUserInfoAboutMembershipsLoading,
    isUserInfoAboutMembershipsFetched,
    fetchUserInfoAboutMemberships,
  ]);

  const handleUserDelete = useCallback(() => {
    if (!userId) {
      return;
    }

    setIsDeleting(true);
    setErrors([]);
    setErrorText("");

    dispatch(
      deleteUser.request({
        callback: (error) => {
          const isFinishedSuccessfully = !error;
          const errorText = error
            ? (isRequestError(error) && error.response?.data?.errorMessage) ||
              "Something went wrong"
            : "";
          const errorsByCommonId =
            isRequestError(error) &&
            (error.response?.data?.data?.errorsByCommonId as ErrorsByCommonId);

          if (errorsByCommonId) {
            const commons = userInfoAboutMembershipsFetched.map(
              ({ common }) => common,
            );
            const errors = parseErrorsByCommonId(errorsByCommonId, commons);

            setErrors(errors);
          }

          setIsDeleting(false);
          setErrorText(errorText);

          if (isFinishedSuccessfully) {
            history.push(ROUTE_PATHS.HOME);
            notify("Your account was successfully deleted");
          }
        },
      }),
    );
  }, [dispatch, notify, history, userId]);

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
          errors={errors}
          userMembershipInfo={userInfoAboutMembershipsFetched}
          onDelete={handleUserDelete}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
};

export default DeleteUserModal;
