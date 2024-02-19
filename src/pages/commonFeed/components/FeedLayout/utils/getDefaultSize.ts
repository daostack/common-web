import { MIN_CONTENT_WIDTH } from "../../../constants";
import { getSavedContentSize } from "./splitViewSize";

export const getDefaultSize = (
  windowWidth: number,
  maxChatSize: number,
): number => {
  const pageWidth = Math.min(windowWidth, 1920);
  const savedChatSize = getSavedContentSize();
  const defaultLeftPaneWidth = Math.max(Math.floor(pageWidth / 4), 400);
  const chatWidth = savedChatSize || defaultLeftPaneWidth;

  return Math.max(Math.min(maxChatSize, chatWidth), MIN_CONTENT_WIDTH);
};
