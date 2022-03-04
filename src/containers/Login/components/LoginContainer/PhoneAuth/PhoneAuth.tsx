import React, { FC, useCallback, useMemo, useState } from "react";
import { Value } from "react-phone-number-input";
import { useSelector } from "react-redux";
import { ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { Button } from "../../../../../shared/components";
import { PhoneAuthStep } from "./constants";
import { PhoneInput } from "../../../../../shared/components/Form";
import { Verification } from "../Verification";
import { AuthStage } from "../constants";
import "./index.scss";

type PhoneAuthProps = {
  setStage: (stage: AuthStage) => void;
};

const PhoneAuth: FC<PhoneAuthProps> = ({ setStage }) => {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [step, setStep] = useState(PhoneAuthStep.PhoneInput);
  const [phoneNumber, setPhoneNumber] = useState<Value | undefined>(undefined);

  const onChangeHandler = useCallback(
    (value) => {
      setPhoneNumber(value);
    },
    [setPhoneNumber]
  );

  const nextStep = () => {
    setStep(PhoneAuthStep.Verification);
  };

  const goBack = useCallback(() => {
    setStep((prev) => prev - 1);
  }, []);

  const onFinish = useCallback(() => {
    setStage(AuthStage.CompleteAccountDetails);
  }, [setStage]);

  const content = useMemo(() => {
    switch (step) {
      case PhoneAuthStep.PhoneInput:
        return (
          <>
            <h2 className="phone-auth__title">Enter your phone number</h2>
            <div className="phone-auth__phone-input">
              <PhoneInput
                value={phoneNumber}
                onChange={onChangeHandler}
                error={""}
              />
            </div>
            <Button
              className="phone-auth__submit-button"
              type="submit"
              onClick={nextStep}
              disabled={!phoneNumber}
            >
              Send Code
            </Button>
          </>
        );
      case PhoneAuthStep.Verification:
        return (
          <Verification
            phoneNumber={phoneNumber}
            goBack={goBack}
            onFinish={onFinish}
          />
        );
      default:
        return null;
    }
  }, [step, goBack, onChangeHandler, phoneNumber, onFinish]);

  return (
    <div className="phone-auth">
      {!isMobileView && (
        <img
          className="phone-auth__img"
          src="/assets/images/human-pyramid-transparent.svg"
          alt={isMobileView ? "Account avatar" : "Human pyramid"}
        />
      )}
      {content}
    </div>
  );
};

export default PhoneAuth;
