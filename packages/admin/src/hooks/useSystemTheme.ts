import React  from 'react';
import { ThemeModes } from './useThemeMode';

export const colorSchemes = {
  light: '(prefers-color-scheme: light)',
  dark: '(prefers-color-scheme: dark)',
};

function onThemeChange(callback) {
  return (event) => {
    if (!event || !event.matches) {
      return;
    }

    console.log(event);

    callback();
  };
}

export const useSystemTheme = (initialTheme: ThemeModes): ThemeModes => {
  const [theme, setTheme] = React.useState(null);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const lightMatch = window.matchMedia(colorSchemes.light);
    const darkMatch = window.matchMedia(colorSchemes.dark);

    setTheme(lightMatch.matches ? 'light' : 'dark');

    const onLightMatches = onThemeChange(() => setTheme('light'));
    const onDarkMatches = onThemeChange(() => setTheme('dark'));

    lightMatch.addEventListener("change", onLightMatches);
    darkMatch.addEventListener("change", onDarkMatches);

    return () => {
      lightMatch.removeEventListener("change", onLightMatches);
      darkMatch.removeEventListener("change", onDarkMatches);
    };
  }, []);

  return theme;
}