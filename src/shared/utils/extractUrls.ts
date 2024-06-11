export const extractUrls = (text: string) =>
  text.match(/https?:\/\/[^\s]+/g) || [];
