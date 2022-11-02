import React, { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Modal } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useModal } from "@/shared/hooks";
import { EventTypeState } from "@/shared/models/Notification";
import { showNotification } from "@/shared/store/actions";
import { getNotification } from "@/shared/store/selectors";
import { BackgroundNotification } from "../BackgroundNotification";

const BackgroundNotificationModal: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    isShowing: isShowingNotification,
    onOpen: showNote,
    onClose: closeNotification,
  } = useModal(false);
  const notification = useSelector(getNotification());

  const closeNotificationHandler = useCallback(() => {
    closeNotification();
    dispatch(showNotification(null));

    if (notification?.type === EventTypeState.fundingRequestAccepted) {
      const path =
        notification.additionalInformation === "0"
          ? ROUTE_PATHS.PROPOSAL_DETAIL.replace(
              ":id",
              notification.eventObjectId,
            )
          : ROUTE_PATHS.SUBMIT_INVOICES.replace(
              ":proposalId",
              notification.eventObjectId,
            );
      history.push(path);
    }
  }, [closeNotification, history, notification, dispatch]);

  useEffect(() => {
    if (notification) {
      showNote();
    }
  }, [notification, showNote]);

  if (!isShowingNotification || !notification) {
    return null;
  }

  return (
    <Modal
      className="notification"
      isShowing={isShowingNotification}
      onClose={closeNotificationHandler}
    >
      <BackgroundNotification
        notification={notification}
        closeHandler={closeNotificationHandler}
      />
    </Modal>
  );
};

export default BackgroundNotificationModal;
