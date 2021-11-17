import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getScreenSize } from "../../../../../../shared/store/selectors";
import { ScreenSize } from "../../../../../../shared/constants";
import { ModalFooter } from "../../../../../../shared/components/Modal";
import { CreationStep } from "./constants";
import "./index.scss";

interface CreationStepsProps {
  setTitle: (title: string) => void;
  setGoBackHandler: (handle?: () => boolean | undefined) => void;
  onFinish: () => void;
}

export default function CreationSteps({ setTitle, setGoBackHandler, onFinish }: CreationStepsProps) {
  const [step, setStep] = useState(CreationStep.GeneralInfo);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleGoBack = useCallback(() => {
    if (step === CreationStep.GeneralInfo) {
      return true;
    }

    setStep(step => step - 1);
  }, [step]);
  const handleContinueClick = useCallback(() => {
    console.log("handleContinueClick");
  }, []);

  useEffect(() => {
    setTitle("Create a Common");
  }, [setTitle]);

  useEffect(() => {
    setGoBackHandler(handleGoBack);
  }, [setGoBackHandler, handleGoBack]);

  return (
    <>
      <div>

      </div>
      <ModalFooter sticky>
        <div className="create-common-steps__modal-footer">
          <button className="button-blue" onClick={handleContinueClick}>
            Continue to Funding
          </button>
        </div>
      </ModalFooter>
    </>
  );
}
