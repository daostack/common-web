import { useCallback, useState } from "react";
import {
  CreateSubCommonPayload,
  IntermediateCreateCommonPayload,
} from "@/pages/OldCommon/interfaces";
import { createSubCommon as createSubCommonApi } from "@/pages/OldCommon/store/api";
import { GovernanceService } from "@/services";
import { Common, Governance } from "@/shared/models";
import { getCommonImageURL } from "./useCommonCreation";

interface Return {
  isSubCommonCreationLoading: boolean;
  data: { common: Common; governance: Governance } | null;
  error: string;
  createSubCommon: (
    creationData: IntermediateCreateCommonPayload,
    commonId: string,
  ) => Promise<void>;
}

const useSubCommonCreation = (): Return => {
  const [isSubCommonCreationLoading, setIsCommonCreationLoading] =
    useState(false);
  const [data, setData] = useState<{
    common: Common;
    governance: Governance;
  } | null>(null);
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
        const governance = await GovernanceService.getGovernanceByCommonId(
          common.id,
        );

        if (!governance) {
          throw new Error(
            `There is no governance for project with id = "${common.id}"`,
          );
        }

        setData({ common, governance });
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
    data,
    error,
    createSubCommon,
  };
};

export default useSubCommonCreation;
