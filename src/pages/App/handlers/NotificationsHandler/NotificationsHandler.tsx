import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import firebaseConfig from "@/config";
import { selectUser } from "@/pages/Auth/store/selectors";
import { NotificationService } from "@/services";

const NotificationsHandler: FC = () => {
  const user = useSelector(selectUser());
  const [isRegistered, setIsRegistered] = useState(false);
  const userId = user?.uid;

  useEffect(() => {
    NotificationService.requestPermissions();
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const unsubscribe = window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log(
              "ServiceWorker registration successful with scope: ",
              registration.scope,
            );
            registration.active?.postMessage({
              type: "INIT_ENV",
              env: firebaseConfig.firebase,
            });
            setIsRegistered(true);
            return registration;
          })
          .catch((err) => {
            console.log("ServiceWorker registration failed: ", err);
          });
      });

      return unsubscribe;
    }
  }, [setIsRegistered]);

  useEffect(() => {
    console.log("--userId", userId, "--isRegistered", isRegistered);
    if (!userId || !isRegistered) {
      return;
    }

    NotificationService.saveFCMToken();

    const unsubscribe = NotificationService.onForegroundMessage();

    return unsubscribe;
  }, [userId, isRegistered]);

  return null;
};

export default NotificationsHandler;
