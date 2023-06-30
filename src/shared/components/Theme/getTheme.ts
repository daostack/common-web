import { StorageKey } from "@/shared/constants";
import { Theme } from "../../constants/theme";

export const getTheme = () => {
  const theme = `${localStorage.getItem(StorageKey.Theme)}` as Theme;
  if ([Theme.Light, Theme.Dark].includes(theme)) {
    return theme;
  }

  const userMedia = window.matchMedia(`(prefers-color-scheme: ${Theme.Light})`);
  if (userMedia.matches) {
    return Theme.Light;
  }

  return Theme.Dark;
};
