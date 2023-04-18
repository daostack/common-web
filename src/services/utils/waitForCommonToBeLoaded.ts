import { store } from "@/shared/appConfig";
import { Common } from "@/shared/models";

export const waitForCommonToBeLoaded = (
  commonId: string,
): Promise<Common | null> =>
  new Promise((resolve, reject) => {
    let count = 0;

    const checkIsCommonLoaded = () => {
      count++;
      const commonState = store.getState().commons.commonStates[commonId];

      if (commonState?.fetched) {
        resolve(commonState.data);
        return;
      }
      if (count >= 30) {
        reject(new Error("Common to be loaded check timed out"));
      }

      setTimeout(checkIsCommonLoaded, 100 * (Math.floor(count / 10) + 1));
    };

    checkIsCommonLoaded();
  });
