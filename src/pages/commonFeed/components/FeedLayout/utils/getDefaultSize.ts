import { MIN_CHAT_WIDTH } from "../../../constants";
import { getSavedChatSize } from "./chatSize";

export const getDefaultSize = (
  windowWidth: number,
  maxChatSize: number,
): number => {
  const pageWidth = Math.min(windowWidth, 1920);
  const savedChatSize = getSavedChatSize();
  const defaultLeftPaneWidth = Math.max(Math.floor(pageWidth / 4), 400);
  const chatWidth = savedChatSize || pageWidth - defaultLeftPaneWidth;

  return Math.max(Math.min(maxChatSize, chatWidth), MIN_CHAT_WIDTH);
};
