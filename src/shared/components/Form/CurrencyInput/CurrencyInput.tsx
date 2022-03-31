import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import BaseCurrencyInput, {
  CurrencyInputProps as BaseCurrencyInputProps,
} from "react-currency-input-field";
import { ErrorText } from "../ErrorText";
import { DEFAULT_INTL_CONFIG } from "./constants";
import "./index.scss";

enum CurrencyInputVariant {
  Default,
  Middle,
}

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
  variant?: CurrencyInputVariant;
  styles?: CurrencyInputStyles;
}

const DEFAULT_INTL_CONFIG: IntlConfig = {
  locale: "en-US",
};

const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  const {
    className,
    label,
    description,
    hint,
    error,
    styles,
    allowNegativeValue,
    intlConfig,
    prefix,
    variant = CurrencyInputVariant.Default,
    ...restProps
  } = props;
  const id = restProps.id || restProps.name;
  const labelWrapperClassName = classNames(
    "custom-currency-input__label-wrapper",
    {
      "custom-currency-input__label-wrapper--with-description": description,
    }
  );
  const inputClassName = classNames(
    "custom-currency-input__input",
    styles?.input?.default,
    {
      "custom-currency-input__input--error": error,
    }
  );

  return (
    <div className={classNames("custom-currency-input", className)}>
      {(label || hint) && (
        <div className={labelWrapperClassName}>
          {label && (
            <label
              htmlFor={id}
              className={classNames(
                "custom-currency-input__label",
                styles?.label
              )}
            >
              {label}
            </label>
          )}
          {hint && <span className="custom-currency-input__hint">{hint}</span>}
        </div>
      )}
      {description && (
        <p
          className={classNames(
            "custom-currency-input__description",
            styles?.description
          )}
        >
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
          prefix={prefix ?? "₪"}
        />
      </div>
      {Boolean(error) && (
        <ErrorText className={styles?.error}>{error}</ErrorText>
      )}
    </div>
  );
};

export default CurrencyInput;
