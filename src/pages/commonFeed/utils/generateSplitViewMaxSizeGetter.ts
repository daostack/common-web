import { MIN_CHAT_WIDTH } from "../constants";

const LEFT_PANE_MIN_WIDTH = 360;

export const generateSplitViewMaxSizeGetter =
  (containerWidth: number): (() => number) =>
  () =>
    Math.max(LEFT_PANE_MIN_WIDTH, containerWidth - MIN_CHAT_WIDTH);
