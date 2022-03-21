import React, { useEffect, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../../interfaces";
import { useCommonCreation } from "../useCases";
import { Processing } from "./Processing";
import "./index.scss";

interface ConfirmationProps {
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  onFinish: (common: Common | null, errorText: string) => void;
  creationData: IntermediateCreateCommonPayload;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { setTitle, setGoBackHandler, onFinish, creationData } = props;
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

    createCommon({
      ...creationData,
      contributionAmount: creationData.contributionAmount * 100,
    });
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

  return <Processing />;
};

export default Confirmation;
