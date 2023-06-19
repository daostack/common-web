import { store } from "@/shared/appConfig";
import { User } from "@/shared/models";

export const waitForUserToBeLoaded = (userId: string): Promise<User | null> =>
  new Promise((resolve, reject) => {
    let count = 0;

    const checkIsUserLoaded = () => {
      count++;
      const userState = store.getState().cache.userStates[userId];

      if (userState?.fetched) {
        resolve(userState.data);
        return;
      }
      if (count >= 30) {
        reject(new Error("User to be loaded check timed out"));
      }

      setTimeout(checkIsUserLoaded, 100 * (Math.floor(count / 10) + 1));
    };

    checkIsUserLoaded();
  });
