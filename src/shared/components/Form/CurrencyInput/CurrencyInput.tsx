import React, { useState, FC } from "react";
import classNames from "classnames";
import BaseCurrencyInput, { CurrencyInputProps as BaseCurrencyInputProps } from "react-currency-input-field";
import { IntlConfig } from "react-currency-input-field/dist/components/CurrencyInputProps";

import { ErrorText } from "../ErrorText";
import "./index.scss";

interface CurrencyInputStyles {
  input?: {
    default?: string;
  };
  error?: string;
}

export interface CurrencyInputProps extends BaseCurrencyInputProps {
  name: string;
  label?: string;
  hint?: string;
  shouldDisplayCount?: boolean;
  error?: string;
  styles?: CurrencyInputStyles;
}

const DEFAULT_INTL_CONFIG: IntlConfig = {
  locale: "en-US",
  currency: "USD",
};

const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  const { className, label, hint, shouldDisplayCount, error, styles, allowNegativeValue, intlConfig, ...restProps } = props;
  const [inputLengthRef, setInputLengthRef] = useState<HTMLSpanElement | null>(null);
  const id = restProps.id || restProps.name;
  const inputStyles = shouldDisplayCount && inputLengthRef
    ? { paddingRight: inputLengthRef.clientWidth + 14 }
    : undefined;
  const inputClassName = classNames("custom-currency-input__input", styles?.input?.default, {
    "custom-currency-input__input--error": error,
  });

  return (
    <div className={classNames("custom-currency-input", className)}>
      {(label || hint) && (
        <div className="custom-currency-input__label-wrapper">
          {label && (
            <label
              htmlFor={id}
              className="custom-currency-input__label"
            >
              {label}
            </label>
          )}
          {hint && <span className="custom-currency-input__hint">{hint}</span>}
        </div>
      )}
      <div className="custom-currency-input__input-wrapper">
        <BaseCurrencyInput
          {...restProps}
          className={inputClassName}
          id={id}
          allowNegativeValue={allowNegativeValue ?? false}
          intlConfig={intlConfig ?? DEFAULT_INTL_CONFIG}
        />
        {shouldDisplayCount && (
          <span
            className="custom-currency-input__input-length"
            ref={setInputLengthRef}
          >
            {typeof restProps.value === 'string' ? restProps.value.length : 0}/{5}
          </span>
        )}
      </div>
      {Boolean(error) && <ErrorText className={styles?.error}>{error}</ErrorText>}
    </div>
  );
};

export default CurrencyInput;
