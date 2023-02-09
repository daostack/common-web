import { UploadFile } from "@/shared/interfaces";
import { CommonLink } from "@/shared/models";
import { getFileNameForUploading, uploadFile as uploadFileToFirebase } from "@/shared/utils/firebaseUploadFile";

class FileService {
  public uploadFile = async ({
    title,
    file,
  }: UploadFile): Promise<CommonLink> => {
    const fileName =
    typeof file === "string" ? title : getFileNameForUploading(file.name);
  const value =
    typeof file === "string"
      ? file
      : await uploadFileToFirebase(fileName, "public_img", file);

  return {
    title: fileName,
    value,
  };
  }

  public uploadFiles = async (
    files: UploadFile[],
  ): Promise<CommonLink[]> => {

    return await  Promise.all(files.map((file) => this.uploadFile(file)));
  }
}

export default new FileService();
