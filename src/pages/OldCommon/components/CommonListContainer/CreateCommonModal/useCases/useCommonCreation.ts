import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { FileService, Logger } from "@/services";
import { Common, Governance } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { getStringFromTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import {
  CreateCommonPayload,
  IntermediateCreateCommonData,
  IntermediateCreateCommonPayload,
} from "../../../../interfaces";
import { createCommon as createCommonAction } from "../../../../store/actions";

interface Return {
  isCommonCreationLoading: boolean;
  data: { common: Common; governance: Governance } | null;
  error: string;
  createCommon: (creationData: IntermediateCreateCommonData) => Promise<void>;
  createCommon_DEPRECATED: (
    creationData: IntermediateCreateCommonPayload,
  ) => Promise<void>;
}

const ERROR_MESSAGE = "Something went wrong...";
const DEFAULT_MEMBER_ADMITTANCE_OPTIONS: MemberAdmittanceLimitations = {
  minFeeMonthly: null,
  minFeeOneTime: null,
  paymentMustGoThrough: false,
};

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

const useCommonCreation = (): Return => {
  const [isCommonCreationLoading, setIsCommonCreationLoading] = useState(false);
  const [data, setData] = useState<{
    common: Common;
    governance: Governance;
  } | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const createCommon = useCallback(
    async (creationData: IntermediateCreateCommonData) => {
      if (isCommonCreationLoading) {
        return;
      }

      setIsCommonCreationLoading(true);

      try {
        const image =
          typeof creationData.image.file === "string"
            ? creationData.image.file
            : (await FileService.uploadFile(creationData.image)).value;
        const gallery =
          creationData.gallery &&
          (await FileService.uploadFiles(creationData.gallery));

        const payload: CreateCommonPayload = {
          gallery,
          image,
          name: creationData.name,
          byline: creationData.byline,
          links: creationData.links,
          useTemplate: true,
          memberAdmittanceOptions: DEFAULT_MEMBER_ADMITTANCE_OPTIONS,
          description:
            creationData.description &&
            getStringFromTextEditorValue(creationData.description),
          video: creationData.videoUrl
            ? {
                title: `Video of ${creationData.name}`,
                value: creationData.videoUrl,
              }
            : undefined,
        };

        dispatch(
          createCommonAction.request({
            payload,
            callback: (error, common) => {
              if (error) {
                Logger.error(error);
              }

              if (error || !common) {
                setError(ERROR_MESSAGE);
              } else {
                setData(common);
              }

              setIsCommonCreationLoading(false);
            },
          }),
        );
      } catch (err) {
        Logger.error(error);
        setError(ERROR_MESSAGE);
        setIsCommonCreationLoading(true);
      }
    },
    [dispatch, isCommonCreationLoading],
  );

  const createCommon_DEPRECATED = useCallback(
    async (creationData: IntermediateCreateCommonPayload) => {
      if (isCommonCreationLoading || !creationData.image) {
        return;
      }

      setIsCommonCreationLoading(true);
      const commonImageURL = await getCommonImageURL(creationData.image);

      if (!commonImageURL) {
        setError(ERROR_MESSAGE);
        setIsCommonCreationLoading(false);
        return;
      }

      const payload: CreateCommonPayload = {
        name: creationData.name,
        image: commonImageURL,
        byline: creationData.byline,
        description: creationData.description,
        unstructuredRules: creationData.rules,
        links: creationData.links,
        useTemplate: true,
        memberAdmittanceOptions:
          creationData.memberAdmittanceOptions ??
          DEFAULT_MEMBER_ADMITTANCE_OPTIONS,
      };

      dispatch(
        createCommonAction.request({
          payload,
          callback: (error, data) => {
            if (error || !data) {
              setError(ERROR_MESSAGE);
            } else {
              setData(data);
            }

            setIsCommonCreationLoading(false);
          },
        }),
      );
    },
    [dispatch, isCommonCreationLoading],
  );

  return {
    isCommonCreationLoading,
    data,
    error,
    createCommon,
    createCommon_DEPRECATED,
  };
};

export default useCommonCreation;
