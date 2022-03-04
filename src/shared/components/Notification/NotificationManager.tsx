import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { NotificationContext, NotificationContextValue } from "./context";

export default function NotificationManager() {
  const [notifications, setNotifications] = useState<ReactNode[]>([]);

  const addNotification = useCallback((value: ReactNode) => {
    setNotifications([...notifications, value]);
  }, [notifications]);

  const contextValue = useMemo<NotificationContextValue>(
    () => ({
      addNotification
    }),
    [addNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      <div>
        {notifications.map((notification) => {
          return <div>{notification}</div>;
        })}
      </div>
    </NotificationContext.Provider>
  )
}
