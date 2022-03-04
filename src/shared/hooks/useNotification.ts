import React from "react";
import { useNotificationContext } from "../components/Notification/context";

const useNotification = () => {
  const { addNotification } = useNotificationContext();


  const notify = (value: React.ReactNode) => {
    addNotification(value);
  }

  return { notify };
}

export default useNotification;
