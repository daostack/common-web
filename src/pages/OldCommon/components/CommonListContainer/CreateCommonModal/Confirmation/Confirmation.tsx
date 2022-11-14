import React, { useEffect, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../../interfaces";
import { useCommonCreation, useSubCommonCreation } from "../useCases";
import { Processing } from "./Processing";

interface ConfirmationProps {
  isSubCommonCreation: boolean;
  parentCommonId?: string;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: (common: Common | null, errorText: string) => void;
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
    common: createdCommon,
    error: commonCreationError,
    createCommon,
  } = useCommonCreation();
  const {
    isSubCommonCreationLoading,
    subCommon: createdSubCommon,
    error: subCommonCreationError,
    createSubCommon,
  } = useSubCommonCreation();
  const isLoading = isCommonCreationLoading || isSubCommonCreationLoading;
  const common = createdCommon || createdSubCommon;
  const error = commonCreationError || subCommonCreationError;

  useEffect(() => {
    if (isLoading || common || error) {
      return;
    }

    if (!isSubCommonCreation) {
      createCommon({ ...creationData });
    } else if (parentCommonId) {
      createSubCommon({ ...creationData }, parentCommonId);
    }
  }, [
    isLoading,
    common,
    error,
    creationData,
    createCommon,
    createSubCommon,
    isSubCommonCreation,
    parentCommonId,
  ]);

  useEffect(() => {
    if (!common && !error) {
      return;
    }

    onFinish(common, error);
  }, [common, error, onFinish]);

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
