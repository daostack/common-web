import React, { useCallback, useMemo, useState, FC, useEffect } from "react";
import { Portal } from "@/shared/components";
import { Notification } from "./Notification";
import { NotificationContext, NotificationContextValue } from "./context";
import { INotification } from "./types";
import "./index.scss";

const MAX_NOTIFICATIONS_DISPLAY = 3;

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const addNotification = useCallback<
    NotificationContextValue["addNotification"]
  >((value) => {
    setNotifications((notifications) =>
      notifications.concat({ id: notifications.length, content: value }),
    );
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== id),
    );
  }, []);

  useEffect(() => {
    if (notifications.length > MAX_NOTIFICATIONS_DISPLAY) {
      setNotifications((notifications) => notifications.slice(1));
    }
  }, [notifications.length]);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      addNotification,
    }),
    [addNotification],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Portal>
        <div className="notifications-container">
          {notifications.map((notification, index) => {
            return (
              <Notification
                key={index}
                notification={notification}
                removeNotification={() => removeNotification(notification.id)}
              />
            );
          })}
        </div>
      </Portal>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
