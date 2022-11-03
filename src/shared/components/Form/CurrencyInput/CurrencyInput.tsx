import React, { FC, ReactNode } from "react";
import BaseCurrencyInput, {
  CurrencyInputProps as BaseCurrencyInputProps,
} from "react-currency-input-field";
import classNames from "classnames";
import { ErrorText } from "../ErrorText";
import { MiddleVariant } from "./MiddleVariant";
import { DEFAULT_INTL_CONFIG } from "./constants";
import "./index.scss";

export enum CurrencyInputVariant {
  Default,
  Middle,
}

interface CurrencyInputStyles {
  label?: string;
  hint?: string;
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
  onCloseClick?: () => void;
  styles?: CurrencyInputStyles;
}

const CurrencyInput: FC<CurrencyInputProps> = (props) => {
  if (props.variant === CurrencyInputVariant.Middle) {
    return <MiddleVariant {...props} />;
  }

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
    ...restProps
  } = props;
  const id = restProps.id || restProps.name;
  const labelWrapperClassName = classNames(
    "custom-currency-input__label-wrapper",
    {
      "custom-currency-input__label-wrapper--with-description": description,
    },
  );
  const inputClassName = classNames(
    "custom-currency-input__input",
    styles?.input?.default,
    {
      "custom-currency-input__input--error": error,
    },
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
                styles?.label,
              )}
            >
              {label}
            </label>
          )}
          {hint && (
            <span
              className={classNames(
                "custom-currency-input__hint",
                styles?.hint,
              )}
            >
              {hint}
            </span>
          )}
        </div>
      )}
      {description && (
        <p
          className={classNames(
            "custom-currency-input__description",
            styles?.description,
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
