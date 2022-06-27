import React, { useMemo, useState, FC, ReactElement } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import moment from "moment";
import { ERROR_TEXT_FOR_NON_EXISTENT_USER } from "@/containers/Login/constants";
import { Button, Loader, ModalFooter } from "@/shared/components";
import {
  PhoneInput,
  PhoneInputCountryCode,
  PhoneInputValue,
} from "@/shared/components/Form";
import {
  ErrorCode,
  ScreenSize,
  RECAPTCHA_CONTAINER_ID,
} from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { isGeneralError } from "@/shared/utils";
import firebase, { isFirebaseError } from "@/shared/utils/firebase";
import {
  confirmVerificationCode,
  sendVerificationCode,
} from "../../../../Auth/store/actions";
import { Verification } from "../Verification";
import { PhoneAuthStep } from "./constants";
import "./index.scss";

interface PhoneAuthProps {
  onFinish: (isNewUser: boolean) => void;
  onError: (errorText?: string) => void;
}

const getCountdownDate = (): Date => moment().add(1, "minute").toDate();

const PhoneAuth: FC<PhoneAuthProps> = ({ onFinish, onError }) => {
  const dispatch = useDispatch();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [step, setStep] = useState(PhoneAuthStep.PhoneInput);
  const [countryCode, setCountryCode] = useState<
    PhoneInputCountryCode | undefined
  >();
  const [phoneNumber, setPhoneNumber] = useState<PhoneInputValue>();
  const [isPhoneNumberTouched, setIsPhoneNumberTouched] = useState(false);
  const [
    confirmation,
    setConfirmation,
  ] = useState<firebase.auth.ConfirmationResult | null>(null);
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [isCodeVerificationLoading, setIsCodeVerificationLoading] = useState(
    false
  );
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [recaptchaContainerKey, setRecaptchaContainerKey] = useState(
    String(Math.random())
  );
  const [countdownDate, setCountdownDate] = useState(getCountdownDate);
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
    setIsCodeInvalid(false);

    dispatch(
      sendVerificationCode.request({
        payload: phoneNumber,
        callback: (error, confirmationResult) => {
          if (error || !confirmationResult) {
            onError();
            return;
          }

          setConfirmation(confirmationResult);
          setCountdownDate(getCountdownDate());
          setStep((step) =>
            step === PhoneAuthStep.Verification
              ? step
              : PhoneAuthStep.Verification
          );
          setIsCodeSending(false);
        },
      })
    );
  };

  const onVerificationCodeSubmit = (code: string) => {
    if (!confirmation) {
      return;
    }

    setIsCodeVerificationLoading(true);
    setIsCodeInvalid(false);

    dispatch(
      confirmVerificationCode.request({
        payload: {
          confirmation,
          code,
        },
        callback: (error, data) => {
          if (!error && data) {
            onFinish(data.isNewUser);
            return;
          }
          if (
            isGeneralError(error) &&
            error.code === ErrorCode.CUserDoesNotExist
          ) {
            onError(ERROR_TEXT_FOR_NON_EXISTENT_USER);
            return;
          }
          if (
            !isFirebaseError(error) ||
            error.code !== "auth/invalid-verification-code"
          ) {
            onError();
            return;
          }

          setIsCodeInvalid(true);
          setIsCodeVerificationLoading(false);
        },
      })
    );
  };

  const goToPhoneInputStep = () => {
    setIsCodeInvalid(false);
    setStep(PhoneAuthStep.PhoneInput);
  };

  const handlePhoneInputBlur = () => {
    setIsPhoneNumberTouched(true);
  };

  const renderContent = (): ReactElement | null => {
    switch (step) {
      case PhoneAuthStep.PhoneInput: {
        const buttonEl = (
          <Button
            className="phone-auth__submit-button"
            onClick={onPhoneNumberSubmit}
            disabled={!phoneNumber || !isValidPhoneNumber(phoneNumber)}
            shouldUseFullWidth
          >
            Send Code
          </Button>
        );

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
            {isMobileView ? (
              <ModalFooter sticky>
                <div className="phone-auth__modal-footer">{buttonEl}</div>
              </ModalFooter>
            ) : (
              buttonEl
            )}
          </>
        );
      }
      case PhoneAuthStep.Verification:
        return (
          <Verification
            phoneNumber={phoneNumber}
            isCodeInvalid={isCodeInvalid}
            countdownDate={countdownDate}
            goBack={goToPhoneInputStep}
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
