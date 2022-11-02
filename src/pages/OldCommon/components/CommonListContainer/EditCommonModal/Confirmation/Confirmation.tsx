import React, { useEffect, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { UpdateCommonData } from "../../../../interfaces";
import { useCommonUpdate } from "../useCases";
import { Processing } from "./Processing";

interface ConfirmationProps {
  parentCommonId?: string;
  commonId: string;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: (common: Common | null, errorText: string) => void;
  currentData: UpdateCommonData;
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
  } = props;
  const {
    isCommonUpdateLoading,
    common: updatedCommon,
    error: commonCreationError,
    updateCommon,
  } = useCommonUpdate(commonId);

  const isLoading = isCommonUpdateLoading;
  const common = updatedCommon;
  const error = commonCreationError;

  useEffect(() => {
    if (isLoading || common || error) {
      return;
    }

    updateCommon({ ...currentData });
  }, [
    isLoading,
    common,
    error,
    currentData,
    updateCommon,
    parentCommonId,
    commonId,
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
