import { debounce } from "lodash";
import { StorageKey } from "@/shared/constants";

export const saveChatSize = debounce((size: number) => {
  localStorage.setItem(StorageKey.ChatSize, String(size));
}, 1000);

export const getSavedChatSize = () =>
  Number(localStorage.getItem(StorageKey.ChatSize)) || 0;
