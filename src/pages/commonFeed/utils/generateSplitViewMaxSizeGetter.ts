import { MIN_CHAT_WIDTH } from "../constants";

const LEFT_PANE_MIN_WIDTH = 360;

export const generateSplitViewMaxSizeGetter =
  (containerWidth: number): (() => number) =>
  () =>
    Math.max(containerWidth - LEFT_PANE_MIN_WIDTH, MIN_CHAT_WIDTH);
