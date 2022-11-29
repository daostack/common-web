export const getActiveItemIdByPath = (path: string): string =>
  path.split("/")[2] || "";
