import React, { useMemo } from "react";

import "./index.scss";
import { NotificationData } from "@/shared/interfaces";
import { EventTypeState } from "@/shared/models/Notification";
import { formatDate } from "@/shared/utils";
import { DateFormat } from "@/shared/models";

interface BackgroundNotification {
  notification: NotificationData;
  closeHandler: () => void;
}

export default function BackgroundNotification({
  notification,
  closeHandler,
}: BackgroundNotification) {
  const img = useMemo(() => {
    switch (notification.type) {
      case EventTypeState.fundingRequestAccepted:
      case EventTypeState.fundingRequestRejected:
        return (
          <img
            alt="notification-background"
            src={`/icons/notifications/${notification.type}.png`}
          />
        );
      default:
        return null;
    }
  }, [notification.type]);

  const header = useMemo(() => {
    switch (notification.type) {
      case EventTypeState.fundingRequestAccepted:
      case EventTypeState.fundingRequestRejected:
        return (
          <div
            className={`content-header ${
              notification.type === EventTypeState.fundingRequestRejected
                ? "rejected"
                : "approved"
            }`}
          >
            <img
              src={`/icons/${
                notification.type === EventTypeState.fundingRequestRejected
                  ? "rejected"
                  : "approved"
              }.svg`}
              alt="proposal state"
            />
            <span>
              {notification.type === EventTypeState.fundingRequestRejected
                ? "Declined on "
                : "Approved on "}
              {formatDate(notification.notification_date, DateFormat.LongHuman)}
            </span>
          </div>
        );

      default:
        return null;
    }
  }, [notification]);

  return (
    <div className="notification-layout-wrapper">
      {img ? (
        <div className={`notification-img-wrapper ${notification.type}`}>
          {img}
        </div>
      ) : null}

      <div className="notification-title">{notification.title}</div>
      <div className="notification-content-wrapper">
        {header}
        <div className="notification-content">{notification.content}</div>
        <div className="notification-additional-information">
          {notification.additional_information}
        </div>
      </div>
      <div className="notification-actions">
        <button className={`button-blue`} onClick={closeHandler}>
          {notification.action_title}
        </button>
      </div>
    </div>
  );
}
