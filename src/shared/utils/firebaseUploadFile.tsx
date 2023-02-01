import { v4 as uuidv4 } from "uuid";
import { UploadFile } from "@/shared/interfaces";
import { CommonLink } from "@/shared/models";
import firebase from "../../shared/utils/firebase";

export const getFileNameForUploading = (fileName: string): string => {
  const ext = fileName.split(".").pop();
  const uniquePart = uuidv4().replace(/-/g, "");

  return `file_${uniquePart}.${ext}`;
};

export async function uploadFile(
  fileName: string,
  fileDirectory: string,
  file: File,
): Promise<string> {
  const filePath = `${fileDirectory}/${fileName}`;
  const ref = firebase.storage().ref(filePath);
  await ref.put(file);
  return await ref.getDownloadURL();
}

export const getFileDownloadInfo = async ({
  title,
  file,
}: UploadFile): Promise<CommonLink> => {
  const fileName =
    typeof file === "string" ? title : getFileNameForUploading(file.name);
  const value =
    typeof file === "string"
      ? file
      : await uploadFile(fileName, "public_img", file);

  return {
    title: fileName,
    value,
  };
};

export const getFilesDownloadInfo = async (
  files: UploadFile[],
): Promise<CommonLink[]> =>
  Promise.all(files.map((file) => getFileDownloadInfo(file)));
