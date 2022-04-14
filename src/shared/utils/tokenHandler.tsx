import { User } from "../models";

export default {
  /**
   * returns token if it exists
   *
   * @return {string | boolean} returns token or false if the token doesn't exist
   */
  get: () => {
    try {
      return localStorage.getItem("token");
    } catch (err) {
      /* eslint-disable */
      console.log("Error ", err);
      /* eslint-enable */
      return false;
    }
  },
  /**
   * sets token if it exists
   *
   */
  set: (token: string) => {
    if (token) localStorage.setItem("token", token);
  },
  setUser: (user: User) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  },
  getUser: () => {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  },
  /**
   * removes token
   *
   */
  remove: () => {
    localStorage.removeItem("token");
  },
  /**
   * clear entire lovalStorage
   *
   */
  removeAll: () => {
    localStorage.clear();
  },

  setShownNotificationList: (id: string) => {
    const list = localStorage.getItem("notifications")
      ? JSON.parse(localStorage.getItem("notifications") as string)
      : [];

    list.push(id);

    localStorage.setItem("notifications", JSON.stringify(list));
  },
  getShownNotificationList: () => {
    return localStorage.getItem("notifications")
      ? JSON.parse(localStorage.getItem("notifications") as string)
      : [];
  },
};
