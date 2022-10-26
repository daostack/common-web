import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Governance } from "@/shared/models";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import {
  UpdateGovernanceData,
  UpdateGovernancePayload,
} from "../../../../interfaces";
import { updateGovernance as updateGovernanceAction } from "../../../../store/actions";

interface Return {
  isGovernanceUpdateLoading: boolean;
  governance: Governance | null;
  error: string;
  updateRules: (
    updateData: UpdateGovernanceData
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

const useRulesUpdate = (governanceId, commonId): Return => {
  const [isGovernanceUpdateLoading, setIsGovernanceUpdateLoading] = useState(false);
  const [governance, setGovernance] = useState<Governance | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const updateRules = useCallback(
    async (updatedData) => {
      if (isGovernanceUpdateLoading) {
        return;
      }

      setIsGovernanceUpdateLoading(true);

      const payload: UpdateGovernancePayload = {
        commonId,
        changes: {
          unstructuredRules: updatedData.unstructuredRules,
        }   
      };

      dispatch(
        updateGovernanceAction.request({
          payload,
          callback: (error, governance) => {
            if (error || !governance) {
              setError("Something went wrong...");
            } else {
              setGovernance(governance);
            }

            setIsGovernanceUpdateLoading(false);
          },
        })
      );
    },
    [dispatch, setIsGovernanceUpdateLoading]
  );

  return {
    isGovernanceUpdateLoading,
    governance,
    error,
    updateRules,
  };
};

export default useRulesUpdate;
