import React, { useEffect, FC, ReactNode } from "react";
import { Governance } from "@/shared/models";
import { UpdateGovernanceRulesData } from "../../../../interfaces";
import { useRulesUpdate } from "../useCases";
import { Processing } from "./Processing";

interface ConfirmationProps {
  parentCommonId?: string;
  commonId: string;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: (governance: Governance | null, errorText: string) => void;
  currentData: UpdateGovernanceRulesData;
  initialGovernance: Governance;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const {
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    currentData,
    parentCommonId,
    commonId,
    initialGovernance,
  } = props;
  const {
    isGovernanceUpdateLoading,
    governance: updatedGovernance,
    error: commonCreationError,
    updateRules,
  } = useRulesUpdate(commonId, initialGovernance);

  const isLoading = isGovernanceUpdateLoading;
  const governance = updatedGovernance;
  const error = commonCreationError;

  useEffect(() => {
    if (isLoading || governance || error) {
      return;
    }

    updateRules({ ...currentData });
  }, [
    isLoading,
    governance,
    error,
    currentData,
    updateRules,
    parentCommonId,
    commonId,
  ]);

  useEffect(() => {
    if (!governance && !error) {
      return;
    }

    onFinish(governance, error);
  }, [governance, error, onFinish]);

  useEffect(() => {
    setTitle(null);
  }, [setTitle]);

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  useEffect(() => {
    setShouldShowCloseButton(false);
  }, [setShouldShowCloseButton]);

  return <Processing />;
};

export default Confirmation;
