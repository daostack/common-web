import { MIN_CONTENT_WIDTH } from "../../../constants";

export const getSplitViewMaxSize = (width: number): number => {
  if (width < 1152) {
    return MIN_CONTENT_WIDTH;
  }
  if (width < 1180) {
    return 656;
  }
  if (width < 1360) {
    return 720;
  }
  if (width < 1460) {
    return 730;
  }
  if (width < 1620) {
    return 790;
  }
  if (width < 1800) {
    return 810;
  }

  return 750;
};
