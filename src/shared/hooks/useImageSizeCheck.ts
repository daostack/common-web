import { useCallback } from "react";
import { useNotification } from "@/shared/hooks";
import { isImageFile, MAX_IMAGE_UPLOAD_SIZE, MAX_IMAGE_UPLOAD_SIZE_ERROR } from "@/shared/constants";

interface Return {
  checkImageSize: (fileName: string, fileSize: number) => boolean;
}

const useImageSizeCheck = (): Return => {
  const { notify } = useNotification();

  const checkImageSize = useCallback((fileName: string, fileSize: number): boolean => {
    if (isImageFile(fileName) && fileSize > MAX_IMAGE_UPLOAD_SIZE) {
      notify(MAX_IMAGE_UPLOAD_SIZE_ERROR);
      return false;
    }

    return true
  }, [notify]);

  return { checkImageSize };
};

export default useImageSizeCheck;
