import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Common } from "@/shared/models";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import {
  UpdateCommonData,
  UpdateCommonPayload,
} from "../../../../interfaces";
import { updateCommon as updateCommonAction } from "../../../../store/actions";

interface Return {
  isCommonUpdateLoading: boolean;
  common: Common | null;
  error: string;
  updateCommon: (
    updateData: UpdateCommonData
  ) => Promise<void>;
}

export const getCommonImageURL = async (
  image: string | File
): Promise<string | null> => {
  if (typeof image === "string") {
    return image;
  }

  try {
    return await uploadFile(
      getFileNameForUploading(image.name),
      "public_img",
      image
    );
  } catch (error) {
    console.error("Error during common image uploading");
    return null;
  }
};

const useCommonUpdate = (commonId): Return => {
  const [isCommonUpdateLoading, setIsCommonUpdateLoading] = useState(false);
  const [common, setCommon] = useState<Common | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const updateCommon = useCallback(
    async (updatedData) => {
      if (isCommonUpdateLoading || !updatedData.image) {
        return;
      }

      setIsCommonUpdateLoading(true);
      const commonImageURL = await getCommonImageURL(updatedData.image);

      if (!commonImageURL) {
        setError("Something went wrong...");
        setIsCommonUpdateLoading(false);
        return;
      }

      const payload: UpdateCommonPayload = {
        commonId,
        changes: {
          name: updatedData.name,
          image: commonImageURL,
          byline: updatedData.byline,
          description: updatedData.description,
          //unstructuredRules: creationData.rules,
          links: updatedData.links,
        }    
      };

      dispatch(
        updateCommonAction.request({
          payload,
          callback: (error, common) => {
            if (error || !common) {
              setError("Something went wrong...");
            } else {
              setCommon(common);
            }

            setIsCommonUpdateLoading(false);
          },
        })
      );
    },
    [dispatch, setIsCommonUpdateLoading]
  );

  return {
    isCommonUpdateLoading,
    common,
    error,
    updateCommon,
  };
};

export default useCommonUpdate;
