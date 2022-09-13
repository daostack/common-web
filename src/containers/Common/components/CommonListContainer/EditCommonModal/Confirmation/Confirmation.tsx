import React, { useEffect, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { UpdateCommonPayload } from "../../../../interfaces";
import { useCommonUpdate } from "../useCases";
import { Processing } from "./Processing";

interface ConfirmationProps {
  parentCommonId?: string;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: (common: Common | null, errorText: string) => void;
  currentData: UpdateCommonPayload;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const {
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    currentData,
    parentCommonId,
  } = props;
  const {
    isCommonUpdateLoading,
    common: createdCommon,
    error: commonCreationError,
    updateCommon,
  } = useCommonUpdate();

  const isLoading = isCommonUpdateLoading;
  const common = createdCommon;
  const error = commonCreationError;

  useEffect(() => {
    if (isLoading || common || error) {
      return;
    }
  }, [
    isLoading,
    common,
    error,
    currentData,
    updateCommon,
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

  return <Processing />;
};

export default Confirmation;
