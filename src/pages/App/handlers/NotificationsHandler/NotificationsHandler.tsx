import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { NotificationService } from "@/services";

const NotificationsHandler: FC = () => {
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const [isRegistered, setIsRegistered] = useState(false);

  function initServiceWorker() {
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

  // Check if the service worker is already registered or register a new one
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration("/firebase-messaging-sw.js")
        .then((existingRegistration) => {
          if (existingRegistration) {
            setIsRegistered(true);
          } else {
            initServiceWorker();
          }

          return;
        })
        .catch((err) => {
          console.log("Error checking service worker registration: ", err);
        });
    }
  }, []);

  // Handle notification permissions and foreground message listener
  useEffect(() => {
    if (!userId || !isRegistered) {
      return;
    }

    let unsubscribeOnMessage;
    (async () => {
      const hasPermissions = await NotificationService.requestPermissions();
      if (!hasPermissions) {
        console.log("Notification permissions denied");
        return;
      }

      await NotificationService.saveFCMToken();
      unsubscribeOnMessage = NotificationService.onForegroundMessage();
    })();

    return () => {
      if (unsubscribeOnMessage) {
        unsubscribeOnMessage();
      }
    };
  }, [userId, isRegistered]);

  return null;
};

export default NotificationsHandler;
