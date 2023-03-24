import { MIN_CHAT_WIDTH } from "../constants";

export const getSplitViewMaxSize = (width: number): number => {
  if (width < 1152) {
    return MIN_CHAT_WIDTH;
  }
  if (width < 1180) {
    return 420;
  }
  if (width < 1270) {
    return 450;
  }
  if (width < 1360) {
    return 420;
  }
  if (width < 1460) {
    return 470;
  }
  if (width < 1620) {
    return 600;
  }
  if (width < 1800) {
    return 750;
  }

  return 940;
};
