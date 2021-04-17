export const replaceAll = (string: string, search: string, replace: string): string => {
  return string.split(search).join(replace);
};