import React, { useCallback, useEffect, useMemo, useState, ReactNode } from "react";

import { isMobile } from "@/shared/utils";
import { Dots } from "@/shared/components";
import { Funding } from "./Funding";
import { GeneralInfo } from "./GeneralInfo";
import { PROGRESS_RELATED_STEPS } from './Progress';
import { Rules } from './Rules';
import { UserAcknowledgment } from './UserAcknowledgment';
import { CreationStep } from "./constants";
import "./index.scss";

interface CreationStepsProps {
  isHeaderScrolledToTop: boolean;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
}

export default function CreationSteps(props: CreationStepsProps) {
  const { isHeaderScrolledToTop, setTitle, setGoBackHandler, setShouldShowCloseButton } = props;
  const [step, setStep] = useState(CreationStep.GeneralInfo);
  const isMobileView = isMobile();

  const handleGoBack = useCallback(() => {
    if (step === CreationStep.GeneralInfo) {
      return true;
    }

    setStep(step => step - 1);
  }, [step]);

  const handleFinish = useCallback(() => {
    if (step === CreationStep.Review) {
      return;
    }

    setStep(step => step + 1);
  }, [step]);

  const shouldShowGoBackButton = useCallback((): boolean => (
    step !== CreationStep.UserAcknowledgment || isMobileView
  ), [step, isMobileView]);

  const shouldShowCloseButton = useCallback((): boolean => (
    step !== CreationStep.UserAcknowledgment || !isMobileView
  ), [step, isMobileView]);

  const shouldShowTitle = useCallback((): boolean => (
    step !== CreationStep.UserAcknowledgment || isMobileView
  ), [step, isMobileView]);

  const title = useMemo(() => {
    if (!shouldShowTitle()) {
      return '';
    }

    const stepIndex = PROGRESS_RELATED_STEPS.findIndex(progressStep => progressStep === step);

    return (
      <div className="create-common-creation-steps__modal-title-wrapper">
        {isMobileView && !isHeaderScrolledToTop && stepIndex !== -1 && (
          <Dots
            className="create-common-creation-steps__modal-title-dots"
            currentStep={stepIndex + 1}
            stepsAmount={PROGRESS_RELATED_STEPS.length}
          />
        )}
        <h3 className="create-common-creation-steps__modal-title">Create a Common</h3>
      </div>
    );
  }, [shouldShowTitle, isMobileView, isHeaderScrolledToTop, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(shouldShowGoBackButton() ? handleGoBack : null);
  }, [setGoBackHandler, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowCloseButton(shouldShowCloseButton());
  }, [setShouldShowCloseButton, shouldShowCloseButton]);

  const content = useMemo(() => {
    switch (step) {
      case CreationStep.GeneralInfo:
        return <GeneralInfo currentStep={step} onFinish={handleFinish} />;
      case CreationStep.UserAcknowledgment:
        return <UserAcknowledgment currentStep={step} onFinish={handleFinish} />;
      case CreationStep.Funding:
        return <Funding currentStep={step} onFinish={handleFinish} />;
      case CreationStep.Rules:
        return <Rules currentStep={step} onFinish={handleFinish} />;
      default:
        return null;
    }
  }, [step, handleFinish]);

  return content;
}
