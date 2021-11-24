import React, { useCallback, useEffect, useMemo, useState, ReactNode } from "react";

import { isMobile } from "@/shared/utils";
import { Dots } from "@/shared/components";
import { GeneralInfo } from "./GeneralInfo";
import { CreationStep } from "./constants";
import "./index.scss";

interface CreationStepsProps {
  isHeaderScrolledToTop: boolean;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handle?: () => boolean | undefined) => void;
  onFinish: () => void;
}

export default function CreationSteps({ isHeaderScrolledToTop, setTitle, setGoBackHandler, onFinish }: CreationStepsProps) {
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

  const title = useMemo(() => {
    return (
      <div className="create-common-creation-steps__modal-title-wrapper">
        {isMobileView && !isHeaderScrolledToTop && (
          <Dots
            className="create-common-creation-steps__modal-title-dots"
            currentStep={step}
            stepsAmount={Object.keys(CreationStep).length / 2}
          />
        )}
        <h3 className="create-common-creation-steps__modal-title">Create a Common</h3>
      </div>
    );
  }, [isMobileView, isHeaderScrolledToTop, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(handleGoBack);
  }, [setGoBackHandler, handleGoBack]);

  const content = useMemo(() => {
    switch (step) {
      case CreationStep.GeneralInfo:
        return <GeneralInfo currentStep={step} onFinish={handleFinish} />;
      default:
        return null;
    }
  }, [step, handleFinish]);

  return content;
}
