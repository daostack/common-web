import React, { useMemo, useState, FC, ReactElement } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Button, Loader } from "../../../../../shared/components";
import {
  PhoneInput,
  PhoneInputCountryCode,
  PhoneInputValue,
} from "../../../../../shared/components/Form";
import {
  ScreenSize,
  RECAPTCHA_CONTAINER_ID,
} from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import firebase from "../../../../../shared/utils/firebase";
import {
  confirmVerificationCode,
  sendVerificationCode,
} from "../../../../Auth/store/actions";
import { Verification } from "../Verification";
import { PhoneAuthStep } from "./constants";
import "./index.scss";

interface PhoneAuthProps {
  onFinish: () => void;
}

const PhoneAuth: FC<PhoneAuthProps> = ({ onFinish }) => {
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [step, setStep] = useState(PhoneAuthStep.PhoneInput);
  const [countryCode, setCountryCode] = useState<
    PhoneInputCountryCode | undefined
  >("GE");
  const [phoneNumber, setPhoneNumber] = useState<PhoneInputValue>(
    "+995598793309"
  );
  const [isPhoneNumberTouched, setIsPhoneNumberTouched] = useState(false);
  const [
    confirmation,
    setConfirmation,
  ] = useState<firebase.auth.ConfirmationResult | null>(null);
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [isCodeVerificationLoading, setIsCodeVerificationLoading] = useState(
    false
  );
  const [recaptchaContainerKey, setRecaptchaContainerKey] = useState(
    String(Math.random())
  );
  const phoneNumberError = useMemo(
    () =>
      !phoneNumber || !isValidPhoneNumber(phoneNumber)
        ? "Please enter valid phone number"
        : "",
    [phoneNumber]
  );
  const isLoading = isCodeSending || isCodeVerificationLoading;

  const onPhoneNumberSubmit = () => {
    if (!phoneNumber || isCodeSending) {
      return;
    }

    setRecaptchaContainerKey(String(Math.random()));
    setIsCodeSending(true);

    dispatch(
      sendVerificationCode.request({
        payload: phoneNumber,
        callback: (error, confirmationResult) => {
          if (!error && confirmationResult) {
            setConfirmation(confirmationResult);
            setStep((step) =>
              step === PhoneAuthStep.Verification
                ? step
                : PhoneAuthStep.Verification
            );
            setIsCodeSending(false);
          } else {
            console.log(error, confirmationResult);
          }
        },
      })
    );
  };

  const onVerificationCodeSubmit = (code: string) => {
    if (!confirmation) {
      return;
    }

    setIsCodeVerificationLoading(true);

    dispatch(
      confirmVerificationCode.request({
        payload: {
          confirmation,
          code,
        },
        callback: (error, user) => {
          if (!error && user) {
            onFinish();
          } else {
            console.log(error);
          }
        },
      })
    );
  };

  const goBack = () => {
    setStep((prev) => prev - 1);
  };

  const handlePhoneInputBlur = () => {
    setIsPhoneNumberTouched(true);
  };

  const renderContent = (): ReactElement | null => {
    switch (step) {
      case PhoneAuthStep.PhoneInput:
        return (
          <>
            <h2 className="phone-auth__title">Enter your phone number</h2>
            <div className="phone-auth__phone-input">
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                onBlur={handlePhoneInputBlur}
                onCountryCodeChange={setCountryCode}
                initialCountryCode={countryCode}
                error={isPhoneNumberTouched ? phoneNumberError : ""}
              />
            </div>
            <Button
              className="phone-auth__submit-button"
              onClick={onPhoneNumberSubmit}
              disabled={!phoneNumber || !isValidPhoneNumber(phoneNumber)}
              shouldUseFullWidth
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
            onFinish={onVerificationCodeSubmit}
            onCodeResend={onPhoneNumberSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={classNames("phone-auth", { "phone-auth--loading": isLoading })}
    >
      {isLoading ? (
        <div>
          <Loader className="phone-auth__loader" />
        </div>
      ) : (
        <>
          {!isMobileView && (
            <img
              className="phone-auth__img"
              src="/assets/images/human-pyramid-transparent.svg"
              alt="Human pyramid"
            />
          )}
          {renderContent()}
        </>
      )}
      <div
        id={RECAPTCHA_CONTAINER_ID}
        key={recaptchaContainerKey}
        className="phone-auth__recaptcha-container"
      />
    </div>
  );
};

export default PhoneAuth;
