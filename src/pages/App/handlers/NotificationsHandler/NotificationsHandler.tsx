import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { NotificationService } from "@/services";

const NotificationsHandler: FC = () => {
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          setIsRegistered(true);
          return registration;
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err);
        });
    }
  }, []);

  useEffect(() => {
    if (!userId && !isRegistered) {
      return;
    }

    let unsubscribeOnMessage;
    (async () => {
      const hasPermissions = await NotificationService.requestPermissions();
      if (hasPermissions) {
        await NotificationService.saveFCMToken();

        unsubscribeOnMessage = NotificationService.onForegroundMessage();
      }
    })();

    return () => {
      unsubscribeOnMessage && unsubscribeOnMessage();
    };
  }, [userId, isRegistered]);

  return null;
};

export default NotificationsHandler;
