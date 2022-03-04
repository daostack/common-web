import React, { FC, useEffect, useState } from "react";
import PinInput from "react-pin-input";
import { Button } from "../../../../../shared/components";
import { PhoneInputValue } from "../../../../../shared/components/Form";
import { verificationCodeStyle } from "./constants";
import "./index.scss";

type VerificationProps = {
  phoneNumber: PhoneInputValue;
  goBack: () => void;
  onFinish: () => void;
};

const Verification: FC<VerificationProps> = ({
  phoneNumber,
  onFinish,
  goBack,
}) => {
  const [timer, setTimer] = useState(60);
  const [buttonText, setButtonText] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((clock) => clock - 1);
    }, 1000);
    setButtonText(`00:${timer}`);
    if (timer === 0) {
      clearInterval(interval);
      setButtonDisabled(false);
      setButtonText("Resend Code");
    }
    return () => clearInterval(interval);
  }, [setButtonText, timer, buttonDisabled]);

  const resendCodeHandler = () => {
    setButtonDisabled(true);
    setTimer(10);
    setButtonText(`00:${timer}`);
  };

  const goBackHandler = () => goBack();

  const inputOnChangeHandler = (value: string, index: number) => {
    setVerificationCode(value);
  };

  const disableCondition = verificationCode.length === 4;

  return (
    <>
      <h2 className="verification__title">Enter verification code</h2>
      <p className="verification__sub-title">
        We have sent the code to the following number
      </p>
      <div className="verification__phone-wrapper">
        <p className="verification__phone-wrapper-number">{phoneNumber}</p>
        <div
          className="verification__phone-wrapper-edit"
          onClick={goBackHandler}
        >
          <img
            className="verification__phone-wrapper-edit-img"
            src="/icons/edit-avatar.svg"
            alt="edit-avatar"
          />
        </div>
      </div>
      <PinInput
        length={4}
        onChange={inputOnChangeHandler}
        type="numeric"
        inputMode="number"
        style={verificationCodeStyle.wrapperStyle}
        inputStyle={verificationCodeStyle.inputStyle}
        // onComplete={(value, index) => {}}
        autoSelect={true}
      />
      <Button
        className="verification__submit-button"
        type="submit"
        onClick={disableCondition ? onFinish : resendCodeHandler}
        disabled={disableCondition ? false : buttonDisabled}
      >
        {disableCondition ? "Submit" : `${buttonText}`}
      </Button>
    </>
  );
};

export default Verification;
