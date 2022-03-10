import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  FC,
} from "react";
import { useSelector } from "react-redux";
import PinInput from "react-pin-input";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import {
  Button,
  ButtonIcon,
  ButtonVariant,
} from "../../../../../shared/components";
import {
  ErrorText,
  PhoneInputValue,
} from "../../../../../shared/components/Form";
import { ScreenSize } from "../../../../../shared/constants";
import { useCountdown } from "../../../../../shared/hooks";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { formatCountdownValue } from "../../../../../shared/utils";
import { verificationCodeStyle } from "./constants";
import "./index.scss";

const CODE_LENGTH = 6;

interface SubmitButtonState {
  text: string;
  handler?: () => void;
  variant: ButtonVariant;
  disabled: boolean;
}

interface VerificationProps {
  phoneNumber: PhoneInputValue;
  isCodeInvalid: boolean;
  countdownDate: Date;
  goBack: () => void;
  onFinish: (code: string) => void;
  onCodeResend: () => void;
}

const Verification: FC<VerificationProps> = (props) => {
  const {
    phoneNumber,
    isCodeInvalid,
    countdownDate,
    goBack,
    onFinish,
    onCodeResend,
  } = props;
  const pinInputRef = useRef<PinInput>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const {
    isFinished: isCountdownFinished,
    minutes,
    seconds,
    startCountdown,
  } = useCountdown();
  const isCodeValid = verificationCode.length === CODE_LENGTH;

  const handleFinish = useCallback(() => {
    if (verificationCode.length === CODE_LENGTH) {
      onFinish(verificationCode);
    }
  }, [onFinish, verificationCode]);

  const submitButtonState = useMemo((): SubmitButtonState => {
    if (isCountdownFinished && !isCodeValid) {
      return {
        text: "Resend code",
        handler: onCodeResend,
        variant: ButtonVariant.Secondary,
        disabled: false,
      };
    }
    if (isCodeValid) {
      return {
        text: "Submit",
        handler: handleFinish,
        variant: ButtonVariant.Primary,
        disabled: false,
      };
    }

    return {
      text: `${formatCountdownValue(minutes)}:${formatCountdownValue(seconds)}`,
      variant: ButtonVariant.Primary,
      disabled: true,
    };
  }, [
    isCountdownFinished,
    isCodeValid,
    onCodeResend,
    handleFinish,
    minutes,
    seconds,
  ]);

  useLayoutEffect(() => {
    startCountdown(countdownDate);

    if (pinInputRef.current) {
      pinInputRef.current.clear();
      pinInputRef.current.focus();
      setVerificationCode("");
    }
  }, [startCountdown, countdownDate]);

  return (
    <>
      <h2 className="verification__title">Enter verification code</h2>
      <p className="verification__sub-title">
        We have sent the code to the following number
      </p>
      <div className="verification__phone-wrapper">
        <p className="verification__phone-wrapper-number">
          {phoneNumber && formatPhoneNumberIntl(phoneNumber)}
        </p>
        <ButtonIcon
          className="verification__phone-wrapper-edit"
          onClick={goBack}
        >
          <img
            className="verification__phone-wrapper-edit-img"
            src="/icons/edit-avatar.svg"
            alt="edit-avatar"
          />
        </ButtonIcon>
      </div>
      <PinInput
        ref={pinInputRef}
        length={CODE_LENGTH}
        onChange={setVerificationCode}
        type="numeric"
        inputMode="number"
        style={verificationCodeStyle.wrapperStyle}
        inputStyle={
          isMobileView
            ? verificationCodeStyle.mobileInputStyle
            : verificationCodeStyle.inputStyle
        }
        autoSelect
      />
      {isCodeInvalid && (
        <ErrorText className="verification__error">
          Verification code is invalid
        </ErrorText>
      )}
      <Button
        className="verification__submit-button"
        onClick={submitButtonState.handler}
        disabled={submitButtonState.disabled}
        variant={submitButtonState.variant}
      >
        {submitButtonState.text}
      </Button>
    </>
  );
};

export default Verification;
