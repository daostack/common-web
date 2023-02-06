import { v4 as uuidv4 } from "uuid";
import firebase from "../../shared/utils/firebase";

export const getFileNameForUploading = (fileName: string): string => {
  const ext = fileName.split(".").pop();
  const uniquePart = uuidv4().replace(/-/g, "");

  return `file_${uniquePart}.${ext}`;
};

export async function uploadFile(
  fileName: string,
  fileDirectory: string,
  file: File
): Promise<string> {
  const filePath = `${fileDirectory}/${fileName}`;
  const ref = firebase.storage().ref(filePath);
  await ref.put(file);
  return await ref.getDownloadURL();
}
