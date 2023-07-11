import { MIN_CHAT_WIDTH } from "../../../constants";

export const getSplitViewMaxSize = (width: number): number => {
  if (width < 1152) {
    return MIN_CHAT_WIDTH;
  }
  if (width < 1180) {
    return 524;
  }
  if (width < 1270) {
    return 550;
  }
  if (width < 1360) {
    return 640;
  }
  if (width < 1460) {
    return 730;
  }
  if (width < 1620) {
    return 830;
  }
  if (width < 1800) {
    return 990;
  }

  return 1170;
};
