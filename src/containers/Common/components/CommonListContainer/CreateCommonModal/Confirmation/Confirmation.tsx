import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import {
  IntermediateCreateCommonPayload,
  PaymentPayload,
} from "../../../../interfaces";
import { useCommonCreation } from "../useCases";
import { Error } from "./Error";
import { Processing } from "./Processing";
import { Success } from "./Success";
import { ConfirmationStep } from "./constants";
import "./index.scss";

interface ConfirmationProps {
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
  paymentData: PaymentPayload;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const {
    setShouldShowCloseButton,
    setTitle,
    setGoBackHandler,
    onFinish,
    creationData,
  } = props;
  const [step, setStep] = useState(ConfirmationStep.Processing);
  const {
    isCommonCreationLoading,
    common,
    error,
    createCommon,
  } = useCommonCreation();
  const history = useHistory();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonPath = ROUTE_PATHS.COMMON_DETAIL.replace(":id", common?.id || "");

  const handleGoToCommon = () => {
    history.push(commonPath);
  };

  const title = useMemo((): ReactNode => {
    if (!isMobileView || step !== ConfirmationStep.Success) {
      return null;
    }

    return (
      <img
        className="create-common-confirmation__title-logo"
        src="/icons/logo.svg"
        alt="Common Logo"
      />
    );
  }, [isMobileView, step]);

  useEffect(() => {
    if (isCommonCreationLoading || common || error) {
      return;
    }

    createCommon(creationData);
  }, [isCommonCreationLoading, common, error, creationData, createCommon]);

  useEffect(() => {
    if (step !== ConfirmationStep.Processing || (!common && !error)) {
      return;
    }

    setStep(
      error || !common ? ConfirmationStep.Error : ConfirmationStep.Success
    );
  }, [step, common, error]);

  useEffect(() => {
    setShouldShowCloseButton(step !== ConfirmationStep.Processing);
  }, [setShouldShowCloseButton, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  const renderContent = () => {
    switch (step) {
      case ConfirmationStep.Processing:
        return <Processing />;
      case ConfirmationStep.Success:
        return common ? (
          <Success common={common} onGoToCommon={handleGoToCommon} />
        ) : null;
      case ConfirmationStep.Error:
        return <Error errorText={error} onFinish={onFinish} />;
      default:
        return null;
    }
  };

  return renderContent();
};

export default Confirmation;
