import { FileService } from "@/services";
import { omit } from "lodash";

export const uploadFilesAndImages = async (newMessages) => {
  return await Promise.all(
    newMessages.map(async (payload) => {
      const [uploadedFiles, uploadedImages] = await Promise.all([
        FileService.uploadFiles(
          (payload.filesPreview ?? []).map((file) =>
            FileService.convertFileInfoToUploadFile(file),
          ),
        ),
        FileService.uploadFiles(
          (payload.imagesPreview ?? []).map((file) =>
            FileService.convertFileInfoToUploadFile(file),
          ),
        ),
      ]);

      const updatedPayload = omit(payload, ["filesPreview", "imagesPreview"]);

      return {
        ...updatedPayload,
        images: uploadedImages,
        files: uploadedFiles,
      };
    }),
  );
};