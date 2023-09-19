import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { FileService, Logger } from "@/services";
import { isRequestError } from "@/services/Api";
import { ErrorCode } from "@/shared/constants";
import { Common } from "@/shared/models";
import { getStringFromTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { getFileNameForUploading, uploadFile } from "@/shared/utils";
import {
  IntermediateUpdateCommonData,
  UpdateCommonData,
  UpdateCommonPayload,
} from "../../../../interfaces";
import { updateCommon as updateCommonAction } from "../../../../store/actions";

interface Return {
  isCommonUpdateLoading: boolean;
  common: Common | null;
  error: string;
  updateCommon: (updateData: IntermediateUpdateCommonData) => Promise<void>;
  updateCommon_DEPRECATED: (updateData: UpdateCommonData) => Promise<void>;
}

export const getCommonImageURL = async (
  image: string | File,
): Promise<string | null> => {
  if (typeof image === "string") {
    return image;
  }

  try {
    return await uploadFile(
      getFileNameForUploading(image.name),
      "public_img",
      image,
    );
  } catch (error) {
    console.error("Error during common image uploading");
    return null;
  }
};

const getErrorMessage = (
  error: unknown | Error | null,
  commonName: string,
): string =>
  isRequestError(error) &&
  error.response?.data?.errorCode === ErrorCode.ArgumentDuplicatedError
    ? `Space with name "${commonName}" already exists`
    : "Something went wrong...";

const useCommonUpdate = (commonId?: string): Return => {
  const [isCommonUpdateLoading, setIsCommonUpdateLoading] = useState(false);
  const [common, setCommon] = useState<Common | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const updateCommon = useCallback(
    async (updatedData: IntermediateUpdateCommonData) => {
      if (isCommonUpdateLoading || !commonId) {
        return;
      }

      console.log(updatedData);

      setIsCommonUpdateLoading(true);

      try {
        const image = updatedData.image
          ? typeof updatedData.image.file === "string"
            ? updatedData.image.file
            : (await FileService.uploadFile(updatedData.image)).value
          : "";
        const gallery =
          updatedData.gallery &&
          (await FileService.uploadFiles(updatedData.gallery));

        const payload: UpdateCommonPayload = {
          commonId,
          changes: {
            name: updatedData.name,
            image,
            byline: updatedData.byline,
            description:
              updatedData.description &&
              getStringFromTextEditorValue(updatedData.description),
            video: updatedData.videoUrl
              ? {
                  title: `Video of ${updatedData.name}`,
                  value: updatedData.videoUrl,
                }
              : undefined,
            gallery,
            links: updatedData.links,
          },
        };

        dispatch(
          updateCommonAction.request({
            payload,
            callback: (error, common) => {
              if (error) {
                Logger.error(error);
              }
              if (error || !common) {
                setError(getErrorMessage(error, updatedData.name));
              } else {
                setCommon(common);
              }

              setIsCommonUpdateLoading(false);
            },
          }),
        );
      } catch (err) {
        Logger.error(error);
        setError(getErrorMessage(err, updatedData.name));
        setIsCommonUpdateLoading(true);
      }
    },
    [dispatch, commonId, setIsCommonUpdateLoading],
  );

  const updateCommon_DEPRECATED = useCallback(
    async (updatedData) => {
      if (isCommonUpdateLoading || !updatedData.image || !commonId) {
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
        },
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
        }),
      );
    },
    [dispatch, setIsCommonUpdateLoading, commonId],
  );

  return {
    isCommonUpdateLoading,
    common,
    error,
    updateCommon,
    updateCommon_DEPRECATED,
  };
};

export default useCommonUpdate;
