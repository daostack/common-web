import React, { useState, FC, ReactElement } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useSelector } from "react-redux";
import { Button } from "../../../../../shared/components";
import {
  PhoneInput,
  PhoneInputValue,
} from "../../../../../shared/components/Form";
import { ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { Verification } from "../Verification";
import { PhoneAuthStep } from "./constants";
import "./index.scss";

interface PhoneAuthProps {
  onFinish: () => void;
}

const PhoneAuth: FC<PhoneAuthProps> = ({ onFinish }) => {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [step, setStep] = useState(PhoneAuthStep.PhoneInput);
  const [phoneNumber, setPhoneNumber] = useState<PhoneInputValue>();

  const nextStep = () => {
    setStep((step) => step + 1);
  };

  const goBack = () => {
    setStep((prev) => prev - 1);
  };

  const renderContent = (): ReactElement | null => {
    switch (step) {
      case PhoneAuthStep.PhoneInput:
        return (
          <>
            <h2 className="phone-auth__title">Enter your phone number</h2>
            <div className="phone-auth__phone-input">
              <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />
            </div>
            <Button
              className="phone-auth__submit-button"
              onClick={nextStep}
              disabled={!phoneNumber || !isValidPhoneNumber(phoneNumber)}
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
  };

  return (
    <div className="phone-auth">
      {!isMobileView && (
        <img
          className="phone-auth__img"
          src="/assets/images/human-pyramid-transparent.svg"
          alt="Human pyramid"
        />
      )}
      {renderContent()}
    </div>
  );
};

export default PhoneAuth;
