import React, { useEffect, FC, ReactNode } from "react";
import { Common, Governance } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../../interfaces";
import { useCommonCreation, useSubCommonCreation } from "../useCases";
import { Processing } from "./Processing";

interface ConfirmationProps {
  isSubCommonCreation: boolean;
  parentCommonId?: string;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: (
    data: { common: Common; governance: Governance } | null,
    errorText: string,
  ) => void;
  creationData: IntermediateCreateCommonPayload;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const {
    isSubCommonCreation,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    creationData,
    parentCommonId,
  } = props;
  const {
    isCommonCreationLoading,
    data: createdCommonData,
    error: commonCreationError,
    createCommon,
  } = useCommonCreation();
  const {
    isSubCommonCreationLoading,
    data: createdSubCommonData,
    error: subCommonCreationError,
    createSubCommon,
  } = useSubCommonCreation();
  const isLoading = isCommonCreationLoading || isSubCommonCreationLoading;
  const data = createdCommonData || createdSubCommonData;
  const error = commonCreationError || subCommonCreationError;

  useEffect(() => {
    if (isLoading || data || error) {
      return;
    }

    if (!isSubCommonCreation) {
      createCommon({ ...creationData });
    } else if (parentCommonId) {
      createSubCommon({ ...creationData }, parentCommonId);
    }
  }, [
    isLoading,
    data,
    error,
    creationData,
    createCommon,
    createSubCommon,
    isSubCommonCreation,
    parentCommonId,
  ]);

  useEffect(() => {
    if (!data && !error) {
      return;
    }

    onFinish(data, error);
  }, [data, error, onFinish]);

  useEffect(() => {
    setTitle(null);
  }, [setTitle]);

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  useEffect(() => {
    setShouldShowCloseButton(false);
  }, [setShouldShowCloseButton]);

  return <Processing isSubCommonCreation={isSubCommonCreation} />;
};

export default Confirmation;
