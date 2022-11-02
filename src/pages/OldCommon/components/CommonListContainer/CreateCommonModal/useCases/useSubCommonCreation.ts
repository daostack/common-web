import { useCallback, useState } from "react";
import {
  CreateSubCommonPayload,
  IntermediateCreateCommonPayload,
} from "@/pages/OldCommon/interfaces";
import { createSubCommon as createSubCommonApi } from "@/pages/OldCommon/store/api";
import { Common } from "@/shared/models";
import { getCommonImageURL } from "./useCommonCreation";

interface Return {
  isSubCommonCreationLoading: boolean;
  subCommon: Common | null;
  error: string;
  createSubCommon: (
    creationData: IntermediateCreateCommonPayload,
    commonId: string,
  ) => Promise<void>;
}

const useSubCommonCreation = (): Return => {
  const [isSubCommonCreationLoading, setIsCommonCreationLoading] =
    useState(false);
  const [subCommon, setSubCommon] = useState<Common | null>(null);
  const [error, setError] = useState("");

  const createSubCommon = useCallback(
    async (creationData: IntermediateCreateCommonPayload, commonId: string) => {
      if (
        isSubCommonCreationLoading ||
        !creationData.image ||
        !creationData.circleIdFromParent
      ) {
        return;
      }

      setIsCommonCreationLoading(true);
      const commonImageURL = await getCommonImageURL(creationData.image);

      if (!commonImageURL) {
        setError("Something went wrong...");
        setIsCommonCreationLoading(false);
        return;
      }

      const payload: CreateSubCommonPayload = {
        commonId,
        name: creationData.name,
        image: commonImageURL,
        byline: creationData.byline,
        description: creationData.description,
        unstructuredRules: creationData.rules,
        links: creationData.links,
        circleId: creationData.circleIdFromParent,
      };

      try {
        const common = await createSubCommonApi(payload);
        setSubCommon(common);
      } catch (error) {
        setError("Something went wrong...");
      } finally {
        setIsCommonCreationLoading(false);
      }
    },
    [isSubCommonCreationLoading],
  );

  return {
    isSubCommonCreationLoading,
    subCommon,
    error,
    createSubCommon,
  };
};

export default useSubCommonCreation;
