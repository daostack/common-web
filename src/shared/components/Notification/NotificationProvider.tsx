import React, { useCallback, useMemo, useState, FC, ReactNode } from "react";
import { NotificationContext, NotificationContextValue } from "./context";

const NotificationProvider: FC = ({ children }) => {
  const [notifications, setNotifications] = useState<ReactNode[]>([]);

  const addNotification = useCallback<
    NotificationContextValue["addNotification"]
  >((value) => {
    setNotifications((notifications) => notifications.concat(value));
  }, []);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      addNotification,
    }),
    [addNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div>
        {notifications.map((notification) => {
          return <div>{notification}</div>;
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
