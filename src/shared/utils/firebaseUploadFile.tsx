import firebase from "../../shared/utils/firebase";

export async function uploadFile(fileName: string, fileDirectory: string, file: File): Promise<string> {
  const filePath = `${fileDirectory}/${fileName}`;
  const ref = firebase.storage().ref(filePath);
  await ref.put(file);
  return await ref.getDownloadURL();
}
