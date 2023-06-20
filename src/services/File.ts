import { v4 as uuidv4 } from "uuid";
import { UploadFile } from "@/shared/interfaces";
import { CommonLink } from "@/shared/models";
import {
  getFileNameForUploading,
  uploadFile as uploadFileToFirebase,
} from "@/shared/utils/firebaseUploadFile";
import { FileInfo } from "@/store/states";
import { MimePrefixes } from "@/shared/constants/mimeTypes";

class FileService {
  public uploadFile = async ({
    title,
    file,
    size,
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
      size,
    };
  };

  public uploadFiles = async (files: UploadFile[]): Promise<CommonLink[]> => {
    return await Promise.all(files.map((file) => this.uploadFile(file)));
  };

  public getImageTypeFromFiles = (files: FileInfo[]) =>
    files.filter(({ info }) => info.type.includes(MimePrefixes.image));

  public getExcludeImageTypeFromFiles = (files: FileInfo[]) =>
    files.filter(({ info }) => !info.type.includes(MimePrefixes.image));

  public convertFileInfoToCommonLink = (file: FileInfo) => ({
    title: file.info.name,
    value: file.src,
    size: file.size,
  });

  public convertFileInfoToUploadFile = (file: FileInfo) => ({
    id: uuidv4(),
    title: file.info.name,
    file: file.info,
    size: file.size,
  });
}

export default new FileService();
