import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import Api from "../../services/Api";

const downloadBlobByURL = async (url: string): Promise<Blob> => {
  const response = url.startsWith("/")
    ? await Api.get<Blob>(url, { responseType: "blob" })
    : await axios.get(url, { responseType: "blob" });

  return new Blob([response.data]);
};

export const saveByURL = async (
  url: string,
  fileName: string
): Promise<void> => {
  try {
    const blob = await downloadBlobByURL(url);

    saveAs(blob, fileName);
  } catch (error) {
    saveAs(url, fileName);
  }
};

export const saveZip = async (
  zipFileName: string,
  files: { url?: string; blob?: Blob; fileName: string }[]
): Promise<void> => {
  const zip = new JSZip();

  await Promise.all(
    files.map(async (file) => {
      try {
        const fileBlob =
          file.blob || (file.url ? await downloadBlobByURL(file.url) : null);

        if (fileBlob) {
          zip.file(file.fileName, fileBlob, { binary: true });
        }
      } catch (error) {
        console.error(`Error during file "${file.fileName}" fetch`, error);
      }
    })
  );

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, zipFileName);
};
