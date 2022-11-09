import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Governance } from "@/shared/models";
import {
  UpdateGovernanceRulesData,
  UpdateGovernanceRulesPayload,
} from "../../../../interfaces";
import { updateGovernanceRules } from "../../../../store/api";

interface Return {
  isGovernanceUpdateLoading: boolean;
  governance: Governance | null;
  error: string;
  updateRules: (updateData: UpdateGovernanceRulesData) => Promise<void>;
}

const useRulesUpdate = (governanceId, commonId): Return => {
  const [isGovernanceUpdateLoading, setIsGovernanceUpdateLoading] =
    useState(false);
  const [governance, setGovernance] = useState<Governance | null>(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const updateRules = useCallback(
    async (updatedData) => {
      if (isGovernanceUpdateLoading) {
        return;
      }

      setIsGovernanceUpdateLoading(true);

      const payload: UpdateGovernanceRulesPayload = {
        commonId,
        changes: updatedData.changes,
        new: updatedData.new,
        remove: updatedData.remove
      };
      try {

        const updatedGovernance = await updateGovernanceRules(payload);
        setGovernance(updatedGovernance);
      } catch(err) {
        setError("Something went wrong...");
      } finally {
        setIsGovernanceUpdateLoading(false);
      }
    },
    [dispatch, setIsGovernanceUpdateLoading],
  );

  return {
    isGovernanceUpdateLoading,
    governance,
    error,
    updateRules,
  };
};

export default useRulesUpdate;
