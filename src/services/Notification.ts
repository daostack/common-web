import firebase from "@/shared/utils/firebase";
import firebaseConfig from "@/config";
import Api from "./Api";

enum NOTIFICATIONS_PERMISSIONS {
  DEFAULT = "default",
  DENIED = "denied",
  GRANTED = "granted"
}


class NotificationService {
  private endpoints: {
    setFCMToken: string;
  };

  constructor() {
    this.endpoints = {
      setFCMToken: '/users/auth/google/set-fcm-token',
    };
  }

  public requestPermissions = async (): Promise<boolean> => {
    try {
      if(Notification.permission === NOTIFICATIONS_PERMISSIONS.GRANTED) {
        return true;
      }
      const permission = await Notification.requestPermission();
        if (permission === NOTIFICATIONS_PERMISSIONS.GRANTED) {
          return true;
        } else {
          return false;
        }
    } catch (err) {
      return false;
    }
  }

  public saveFCMToken = async (): Promise<void> => {
    try {
        const token = await firebase.messaging().getToken({ vapidKey: firebaseConfig.vapidKey });
        if (token) {
      
          console.log('---token',token);
          await Api.post(
            this.endpoints.setFCMToken,
            {
              token,
            }
          );
        }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  }

  public onForegroundMessage = () => {
    const unsubscribe =  firebase.messaging().onMessage((payload) => {
      
      const { title, body } = payload.notification;
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          data: payload?.data,
          icon: "/logo.png",
        });
      }
    });

    return unsubscribe;
  }
}

export default new NotificationService();
