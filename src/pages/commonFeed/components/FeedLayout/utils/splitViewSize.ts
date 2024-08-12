import { debounce } from "lodash-es";
import { StorageKey } from "@/shared/constants";

export const saveChatSize = debounce((size: number) => {
  localStorage.setItem(StorageKey.ChatSize, String(size));
}, 1000);

export const saveContentSize = debounce((size: number) => {
  localStorage.setItem(StorageKey.ContentSize, String(size));
}, 1000);

export const getSavedChatSize = () =>
  Number(localStorage.getItem(StorageKey.ChatSize)) || 0;

export const getSavedContentSize = () =>
  Number(localStorage.getItem(StorageKey.ContentSize)) || 0;
