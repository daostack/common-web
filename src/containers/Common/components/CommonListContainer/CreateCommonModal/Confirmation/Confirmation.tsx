import React, { useEffect, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../../interfaces";
import { useCommonCreation } from "../useCases";
import { Processing } from "./Processing";

interface ConfirmationProps {
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: (common: Common | null, errorText: string) => void;
  creationData: IntermediateCreateCommonPayload;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const {
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    creationData,
  } = props;
  const {
    isCommonCreationLoading,
    common,
    error,
    createCommon,
  } = useCommonCreation();

  useEffect(() => {
    if (isCommonCreationLoading || common || error) {
      return;
    }

    createCommon({ ...creationData });
  }, [isCommonCreationLoading, common, error, creationData, createCommon]);

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

  return <Processing />;
};

export default Confirmation;
