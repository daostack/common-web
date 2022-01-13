import { DEFAULT_PANEL_ID_TEMPLATE } from "./constants";

export const getPanelId = (
  value: unknown,
  panelIdTemplate = DEFAULT_PANEL_ID_TEMPLATE
): string => `${panelIdTemplate}-${value}`;

export const getLabelId = (panelId: string): string => `label-${panelId}`;
