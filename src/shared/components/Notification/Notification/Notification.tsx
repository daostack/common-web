import React, { useEffect } from "react";
import { INotification } from "../NotificationProvider";
import "./index.scss";

interface IProps {
  notification: INotification;
  removeNotification: () => void;
}

export default function Notification({ notification, removeNotification }: IProps) {
  
  useEffect(() => {
    const removeTimeout = setTimeout(() => removeNotification(), 5000);
    return () => {
      clearTimeout(removeTimeout);
    };
  }, [notification.id, removeNotification])

  return (
    <div className="notification-wrapper">
      <div>{notification.content}</div>
      <button className="dismiss-btn" onClick={removeNotification}>OK</button>
    </div>
  )
}
