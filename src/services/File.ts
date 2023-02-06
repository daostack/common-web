import { UploadFile } from "@/shared/interfaces";
import { CommonLink } from "@/shared/models";
import { getFileNameForUploading, uploadFile } from "@/shared/utils/firebaseUploadFile";

class FileService {
  public uploadFiles = async (
    files?: UploadFile[],
  ): Promise<CommonLink[] | undefined> => {

    return files &&
    (await Promise.all(
      files.map<Promise<CommonLink>>(async ({ title, file }) => {
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
      }),
    ));
  }
}

export default new FileService();
