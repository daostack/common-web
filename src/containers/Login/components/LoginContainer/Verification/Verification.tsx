import React, { FC, useEffect, useState } from "react";
import { Value } from "react-phone-number-input";
import PinInput from "react-pin-input";
import { Button } from "../../../../../shared/components";
import { verificationCodeStyle } from "./constants";
import "./index.scss";

type VerificationProps = {
  phoneNumber: Value | undefined;
  goBack: () => void;
  onFinish: () => void;
};

const Verification: FC<VerificationProps> = ({
  phoneNumber,
  onFinish,
  goBack,
}) => {
  const [clock, setClock] = useState(10);
  const [buttonText, setButtonText] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [code, setCode] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setClock((clock) => clock - 1);
    }, 1000);
    setButtonText(`00:${clock}`);
    if (clock === 0) {
      clearInterval(interval);
      setButtonDisabled(false);
      setButtonText("Resend Code");
    }
    return () => clearInterval(interval);
  }, [setButtonText, clock, buttonDisabled]);

  const resendCodeHandler = () => {
    setButtonDisabled(true);
    setClock(10);
    setButtonText(`00:${clock}`);
  };

  const goBackHandler = () => goBack();

  const inputOnChangeHandler = (value: string, index: number) => {
    setCode(value);
  };

  const disableCondition = code.length === 4;

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
