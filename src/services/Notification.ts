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
      const permission = await Notification.requestPermission();
        if (permission === NOTIFICATIONS_PERMISSIONS.GRANTED) {
          console.log('Notification permission granted.');
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
      console.log('-hastPermissions', firebaseConfig.vapidKey);
        const token = await firebase.messaging().getToken({ vapidKey: firebaseConfig.vapidKey });
        if (token) {
          try {
            console.log("FCM Token:", token);
      
            await Api.post(
              this.endpoints.setFCMToken,
              {
                token,
              }
            );
          } catch (error) {
            console.error("An error occurred while retrieving token. ", error);
          }
        } else {
          console.log("No registration token available. Request permission to generate one.");
        }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  }

  public onForegroundMessage = () => {
    return firebase.messaging().onMessage((payload) => {
      console.log('Message received. ', payload);
      
      const { title, body } = payload.notification;
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          data: payload.data,
          icon: '/logo.png', // Replace with your icon
        });
      }
    });
  }
}

export default new NotificationService();
