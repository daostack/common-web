import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  FC,
} from "react";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import PinInput from "react-pin-input";
import { useSelector } from "react-redux";
import {
  Button,
  ButtonIcon,
  ButtonVariant,
  ModalFooter,
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

  const inputStyle = isMobileView
    ? verificationCodeStyle.mobileInputStyle
    : verificationCodeStyle.inputStyle;

  const buttonEl = (
    <Button
      className="verification__submit-button"
      onClick={submitButtonState.handler}
      disabled={submitButtonState.disabled}
      variant={submitButtonState.variant}
      shouldUseFullWidth
    >
      {submitButtonState.text}
    </Button>
  );

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
      <div className="verification__code-wrapper">
        <PinInput
          ref={pinInputRef}
          length={CODE_LENGTH}
          onChange={setVerificationCode}
          type="numeric"
          inputMode="number"
          style={verificationCodeStyle.wrapperStyle}
          inputStyle={inputStyle}
          inputFocusStyle={inputStyle}
          autoSelect
        />
      </div>
      {isCodeInvalid && (
        <ErrorText className="verification__error">
          Verification code is invalid
        </ErrorText>
      )}
      {isMobileView ? (
        <ModalFooter sticky>
          <div className="verification__modal-footer">{buttonEl}</div>
        </ModalFooter>
      ) : (
        buttonEl
      )}
    </>
  );
};

export default Verification;
