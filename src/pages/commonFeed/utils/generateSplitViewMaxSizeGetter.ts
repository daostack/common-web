import { MIN_CHAT_WIDTH } from "../constants";

export const generateSplitViewMaxSizeGetter =
  (containerWidth: number): (() => number) =>
  () =>
    containerWidth < 1100 ? MIN_CHAT_WIDTH : Math.floor(containerWidth * 0.6);
