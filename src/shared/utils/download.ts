import { saveAs } from "file-saver";

export const downloadByURL = (url: string, fileName?: string) => {
  saveAs(url, fileName);
};
