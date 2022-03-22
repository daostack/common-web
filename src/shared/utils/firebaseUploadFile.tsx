import firebase from "../../shared/utils/firebase";

export const getFileNameForUploading = (fileName: string): string => {
  const ext = fileName.split(".").pop();
  const timeStamp = new Date().getTime();

  return `img_${timeStamp}.${ext}`;
};

export async function uploadFile(fileName: string, fileDirectory: string, file: File): Promise<string> {
  const filePath = `${fileDirectory}/${fileName}`;
  const ref = firebase.storage().ref(filePath);
  await ref.put(file);
  return await ref.getDownloadURL();
}
