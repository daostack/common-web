//import { StorageKey } from "@/shared/constants";
import { Theme } from "../constants/theme";

export const getTheme = () => {
  /**
   * Light mode is the default until we have a complete color scheme for dark mode.
   */
  return Theme.Light;

  // const theme = localStorage.getItem(StorageKey.Theme) as Theme | null;
  // if (theme && Object.values(Theme).includes(theme)) {
  //   return theme;
  // }

  // const isDarkThemePreferred = window.matchMedia(
  //   `(prefers-color-scheme: ${Theme.Dark})`,
  // );
  // return isDarkThemePreferred ? Theme.Dark : Theme.Light;
};
