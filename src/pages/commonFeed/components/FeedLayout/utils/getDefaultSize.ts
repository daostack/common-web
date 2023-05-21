import { MIN_CHAT_WIDTH } from "../constants";
import { getSavedChatSize } from "./chatSize";

export const getDefaultSize = (
  windowWidth: number,
  maxChatSize: number,
): number => {
  const pageWidth = Math.min(windowWidth, 1920);
  const sidenavWidth = 336;
  const savedChatSize = getSavedChatSize();
  const chatWidth =
    savedChatSize || Math.floor((pageWidth - sidenavWidth) * 0.6);

  return Math.max(Math.min(maxChatSize, chatWidth), MIN_CHAT_WIDTH);
};
