import { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import firebaseConfig from "@/config";
import { selectUser } from "@/pages/Auth/store/selectors";
import { NotificationService } from "@/services";

const NotificationsHandler: FC = () => {
  const user = useSelector(selectUser());
  const userId = user?.uid;

  // useEffect(() => {
  //   NotificationService.requestPermissions();
  // }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let unsubscribeOnMessage;
    let unsubscribeLoad;
    (async () => {
      const hasPermissions = await NotificationService.requestPermissions();
      console.log("-hasPermissions", hasPermissions);
      if (hasPermissions) {
        await NotificationService.saveFCMToken();

        unsubscribeOnMessage = NotificationService.onForegroundMessage();

        if ("serviceWorker" in navigator) {
          console.log("--here");
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then((registration) => {
              console.log(
                "ServiceWorker registration successful with scope: ",
                registration.scope,
              );
              // registration.active?.postMessage({
              //   type: "INIT_ENV",
              //   env: firebaseConfig.firebase,
              // });

              console.log("---registration", registration);
              if (registration.active) {
                registration.active.postMessage({
                  type: "INIT_ENV",
                  env: firebaseConfig.firebase,
                });
              } else if (registration?.installing) {
                registration.installing.addEventListener("statechange", () => {
                  if (registration?.installing?.state === "activated") {
                    registration.installing.postMessage({
                      type: "INIT_ENV",
                      env: firebaseConfig.firebase,
                    });
                  }
                });
              } else if (registration?.waiting) {
                registration.waiting.addEventListener("statechange", () => {
                  if (registration?.waiting?.state === "activated") {
                    registration.waiting.postMessage({
                      type: "INIT_ENV",
                      env: firebaseConfig.firebase,
                    });
                  }
                });
              }
              return registration;
            })
            .catch((err) => {
              console.log("ServiceWorker registration failed: ", err);
            });
          unsubscribeLoad = window.addEventListener("load", () => {});
        }
      }
    })();

    return () => {
      unsubscribeLoad && unsubscribeLoad();
      unsubscribeOnMessage && unsubscribeOnMessage();
    };
  }, [userId]);

  // useEffect(() => {
  //   console.log("--userId", userId, "--isRegistered", isRegistered);
  //   if (!userId || !isRegistered) {
  //     return;
  //   }

  //   NotificationService.saveFCMToken();

  //   const unsubscribe = NotificationService.onForegroundMessage();

  //   return unsubscribe;
  // }, [userId, isRegistered]);

  return null;
};

export default NotificationsHandler;
