import React, { useCallback, useEffect, useMemo, useState } from "react";

import { GeneralInfo } from "./GeneralInfo";
import { CreationStep } from "./constants";

interface CreationStepsProps {
  setTitle: (title: string) => void;
  setGoBackHandler: (handle?: () => boolean | undefined) => void;
  onFinish: () => void;
}

export default function CreationSteps({ setTitle, setGoBackHandler, onFinish }: CreationStepsProps) {
  const [step, setStep] = useState(CreationStep.GeneralInfo);

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

  useEffect(() => {
    setTitle("Create a Common");
  }, [setTitle]);

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
  }, [step]);

  return content;
}
