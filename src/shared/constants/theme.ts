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
  tertiaryText,
  quaternaryText,
  gentleStroke,
  warning,
  primaryFill,
  secondaryFill,
  tertiaryFill,
  quaternaryFill,
  quinaryFill,
  dropShadow,
  dropShadowSecondary,
  mentionPrimary,
  mentionSecondary,
  highlight,
}

export const ThemeColorsValues = {
  [Theme.Light]: {
    [ThemeColors.primaryBackground]: "#ffffff",
    [ThemeColors.secondaryBackground]: "#f8f8f5",
    [ThemeColors.hoverFill]: "#fbf1f8",
    [ThemeColors.secondaryHoverFill]: "#f0f0f0",
    [ThemeColors.primaryText]: "#001a36",
    [ThemeColors.secondaryText]: "#a75a93",
    [ThemeColors.tertiaryText]: "#ffffff",
    [ThemeColors.quaternaryText]: "#edcedf",
    [ThemeColors.gentleStroke]: "#f4f5f5",
    [ThemeColors.warning]: "#ff603e",
    [ThemeColors.primaryFill]: "#b5407f",
    [ThemeColors.secondaryFill]: "#ddd",
    [ThemeColors.tertiaryFill]: "#ffffff",
    [ThemeColors.quaternaryFill]: "#943367",
    [ThemeColors.quinaryFill]: "#edcedf",
    [ThemeColors.dropShadow]: "rgba(0, 0, 0, 0.15259)",
    [ThemeColors.dropShadowSecondary]: "rgba(187, 187, 187, 0.7)",
    [ThemeColors.mentionPrimary]: "#d84c7f",
    [ThemeColors.mentionSecondary]: "#ffa6d7",
    [ThemeColors.highlight]: "#D84CA0",
  },
  [Theme.Dark]: {
    [ThemeColors.primaryBackground]: "#101010",
    [ThemeColors.secondaryBackground]: "#1f2124",
    [ThemeColors.hoverFill]: "#271d21",
    [ThemeColors.secondaryHoverFill]: "#432b33",
    [ThemeColors.primaryText]: "#ddd",
    [ThemeColors.secondaryText]: "#a75a93",
    [ThemeColors.tertiaryText]: "#001a36",
    [ThemeColors.quaternaryText]: "#432B33",
    [ThemeColors.gentleStroke]: "#1F2124",
    [ThemeColors.warning]: "#ff603e",
    [ThemeColors.primaryFill]: "#d84c7f",
    [ThemeColors.secondaryFill]: "#464853",
    [ThemeColors.tertiaryFill]: "#131b23",
    [ThemeColors.quaternaryFill]: "#EF9DBA",
    [ThemeColors.quinaryFill]: "#432B33",
    [ThemeColors.dropShadow]: "rgba(0, 0, 0, 0.15259)",
    [ThemeColors.dropShadowSecondary]: "rgba(104, 104, 104, 0.7)",
    [ThemeColors.mentionPrimary]: "#d84c7f",
    [ThemeColors.mentionSecondary]: "#ffa6d7",
    [ThemeColors.highlight]: "#D84CA0",
  },
};
