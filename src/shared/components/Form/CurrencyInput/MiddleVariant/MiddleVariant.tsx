import React, { FC } from "react";
import BaseCurrencyInput from "react-currency-input-field";
import classNames from "classnames";
import CloseIcon from "@/shared/icons/close.icon";
import { ButtonIcon } from "../../../ButtonIcon";
import { ErrorText } from "../../ErrorText";
import { CurrencyInputProps } from "../CurrencyInput";
import { DEFAULT_INTL_CONFIG } from "../constants";
import "./index.scss";

const MiddleVariant: FC<CurrencyInputProps> = (props) => {
  const {
    className,
    label,
    error,
    styles,
    allowNegativeValue,
    intlConfig,
    prefix,
    onCloseClick,
    ...restProps
  } = props;
  const id = restProps.id || restProps.name;
  const inputClassName = classNames("custom-currency-input-middle__input", {
    "custom-currency-input-middle__input--error": error,
  });

  return (
    <div className={classNames("custom-currency-input-middle", className)}>
      <div className="custom-currency-input-middle__input-wrapper">
        {label && (
          <label htmlFor={id} className="custom-currency-input-middle__label">
            {label}
          </label>
        )}
        <ButtonIcon
          className="custom-currency-input-middle__close-button"
          onClick={onCloseClick}
        >
          <CloseIcon
            className="custom-currency-input-middle__close-icon"
            width="12"
            height="12"
            fill="currentColor"
          />
        </ButtonIcon>
        <BaseCurrencyInput
          {...restProps}
          className={inputClassName}
          id={id}
          allowNegativeValue={allowNegativeValue ?? false}
          intlConfig={intlConfig ?? DEFAULT_INTL_CONFIG}
          prefix={prefix ?? "₪"}
        />
      </div>
      {Boolean(error) && (
        <ErrorText className={styles?.error}>{error}</ErrorText>
      )}
    </div>
  );
};

export default MiddleVariant;
