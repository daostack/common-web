export enum Theme {
  Light = "light",
  Dark = "dark",
}

export enum ThemeColors {
  primaryBackground,
  secondaryBackground,
  hoverFill,
  secondaryHoverFill,
  primaryText,
  secondaryText,
  gentleStroke,
  warning,
  primaryFill,
  secondaryFill,
  tertiaryFill,
  quaternaryFill,
  dropShadow,
}

export const ThemeColorsValues = {
  [Theme.Light]: {
    [ThemeColors.primaryBackground]: "#ffffff",
    [ThemeColors.secondaryBackground]: "#f8f8f5",
    [ThemeColors.hoverFill]: "#fff9fd",
    [ThemeColors.secondaryHoverFill]: "#fff9fd",
    [ThemeColors.primaryText]: "#001a36",
    [ThemeColors.secondaryText]: "#a75a93",
    [ThemeColors.gentleStroke]: "#f4f5f5",
    [ThemeColors.warning]: "#ff603e",
    [ThemeColors.primaryFill]: "#c32ea3",
    [ThemeColors.secondaryFill]: "#f3d4eb",
    [ThemeColors.tertiaryFill]: "#ffffff",
    [ThemeColors.quaternaryFill]: "#d5d5e4",
    [ThemeColors.dropShadow]: "rgba(0, 0, 0, 0.15259)",
  },
  [Theme.Dark]: {
    [ThemeColors.primaryBackground]: "#1f2535",
    [ThemeColors.secondaryBackground]: "#2e3452",
    [ThemeColors.hoverFill]: "#131b23",
    [ThemeColors.secondaryHoverFill]: "#2e3452",
    [ThemeColors.primaryText]: "#ffffff",
    [ThemeColors.secondaryText]: "#a75a93",
    [ThemeColors.gentleStroke]: "#2e3452",
    [ThemeColors.warning]: "#ff603e",
    [ThemeColors.primaryFill]: "#c32ea3",
    [ThemeColors.secondaryFill]: "#743b65",
    [ThemeColors.tertiaryFill]: "#131b23",
    [ThemeColors.quaternaryFill]: "#525876",
    [ThemeColors.dropShadow]: "rgba(0, 0, 0, 0.15259)",
  },
};
