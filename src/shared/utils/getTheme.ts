import { StorageKey, Theme } from "@/shared/constants";

export const getTheme = () => {
  const theme = localStorage.getItem(StorageKey.Theme) as Theme | null;

  if (theme && Object.values(Theme).includes(theme)) {
    return theme;
  }

  const isDarkThemePreferred = window.matchMedia(
    `(prefers-color-scheme: ${Theme.Dark})`,
  );

  return isDarkThemePreferred ? Theme.Dark : Theme.Light;
};