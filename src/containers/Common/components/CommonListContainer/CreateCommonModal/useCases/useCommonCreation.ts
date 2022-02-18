import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Common } from "@/shared/models";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import {
  CreateCommonPayload,
  IntermediateCreateCommonPayload,
} from "../../../../interfaces";
import { createCommon as createCommonAction } from "../../../../store/actions";

interface Return {
  isCommonCreationLoading: boolean;
  common: Common | null;
  error: string;
  createCommon: (creationData: IntermediateCreateCommonPayload) => void;
}

const getCommonImageURL = async (
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

const useCommonCreation = (): Return => {
  const [isCommonCreationLoading, setIsCommonCreationLoading] = useState(false);
  const [common, setCommon] = useState<Common | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const createCommon = useCallback(
    async (creationData: IntermediateCreateCommonPayload) => {
      if (isCommonCreationLoading || !creationData.image) {
        return;
      }

      setIsCommonCreationLoading(true);
      const commonImageURL = await getCommonImageURL(creationData.image);

      if (!commonImageURL) {
        setError("Something went wrong...");
        setIsCommonCreationLoading(false);
        return;
      }

      const payload: CreateCommonPayload = {
        name: creationData.name,
        image: commonImageURL,
        byline: creationData.byline,
        description: creationData.description,
        contributionAmount: creationData.contributionAmount,
        contributionType: creationData.contributionType,
        rules: creationData.rules,
        links: creationData.links,
        zeroContribution: creationData.zeroContribution,
      };

      dispatch(
        createCommonAction.request({
          payload,
          callback: (error, common) => {
            if (error || !common) {
              setError("Something went wrong...");
            } else {
              setCommon(common);
            }

            setIsCommonCreationLoading(false);
          },
        })
      );
    },
    [dispatch, isCommonCreationLoading]
  );

  return {
    isCommonCreationLoading,
    common,
    error,
    createCommon,
  };
};

export default useCommonCreation;
