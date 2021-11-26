import React, { useState, FC, ReactNode } from "react";
import classNames from "classnames";
import BaseCurrencyInput, { CurrencyInputProps as BaseCurrencyInputProps } from "react-currency-input-field";
import { IntlConfig } from "react-currency-input-field/dist/components/CurrencyInputProps";

import { ErrorText } from "../ErrorText";
import "./index.scss";

interface CurrencyInputStyles {
  label?: string;
  description?: string;
  input?: {
    default?: string;
  };
  error?: string;
}

export interface CurrencyInputProps extends BaseCurrencyInputProps {
  name: string;
  label?: ReactNode;
  description?: string;
  hint?: string;
  error?: string;
  styles?: CurrencyInputStyles;
}

const DEFAULT_INTL_CONFIG: IntlConfig = {
  locale: "en-US",
  currency: "USD",
};

const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  const { className, label, description, hint, error, styles, allowNegativeValue, intlConfig, ...restProps } = props;
  const id = restProps.id || restProps.name;
  const labelWrapperClassName = classNames("custom-currency-input__label-wrapper", {
    "custom-currency-input__label-wrapper--with-description": description,
  });
  const inputClassName = classNames("custom-currency-input__input", styles?.input?.default, {
    "custom-currency-input__input--error": error,
  });

  return (
    <div className={classNames("custom-currency-input", className)}>
      {(label || hint) && (
        <div className={labelWrapperClassName}>
          {label && (
            <label
              htmlFor={id}
              className={classNames("custom-currency-input__label", styles?.label)}
            >
              {label}
            </label>
          )}
          {hint && <span className="custom-currency-input__hint">{hint}</span>}
        </div>
      )}
      {description && (
        <p className={classNames("custom-currency-input__description", styles?.description)}>
          {description}
        </p>
      )}
      <div className="custom-currency-input__input-wrapper">
        <BaseCurrencyInput
          {...restProps}
          className={inputClassName}
          id={id}
          allowNegativeValue={allowNegativeValue ?? false}
          intlConfig={intlConfig ?? DEFAULT_INTL_CONFIG}
        />
      </div>
      {Boolean(error) && <ErrorText className={styles?.error}>{error}</ErrorText>}
    </div>
  );
};

export default CurrencyInput;
