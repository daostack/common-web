import React, { useCallback, useEffect, useMemo, useState } from "react";

import { ModalHeaderContent } from "../../../../../../shared/components/Modal";
import { GeneralInfo } from "./GeneralInfo";
import { Progress } from "./Progress";
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

  useEffect(() => {
    setTitle("Create a Common");
  }, [setTitle]);

  useEffect(() => {
    setGoBackHandler(handleGoBack);
  }, [setGoBackHandler, handleGoBack]);

  const content = useMemo(() => {
    switch (step) {
      case CreationStep.GeneralInfo:
        return <GeneralInfo />;
      default:
        return null;
    }
  }, [step]);

  return (
    <>
      <ModalHeaderContent>
        <Progress creationStep={step} />
      </ModalHeaderContent>
      {content}
    </>
  );
}
