import React, { useRef } from "react";
import classNames from "classnames";
import { useField } from "formik";
import { FieldHookConfig } from "formik/dist/Field";

import "./index.scss";

type TextFieldProps = FieldHookConfig<string> & {
  label?: string;
  isRequired?: boolean;
  hint?: string;
  maxLength?: number;
  shouldDisplayCount?: boolean;
};

const TextField = (props: TextFieldProps) => {
  const { label, isRequired, hint, maxLength, shouldDisplayCount, ...restProps } = props;
  const [field, { value = '', touched, error }] = useField(restProps);
  const inputLengthRef = useRef<HTMLSpanElement>(null);
  const hintToShow = hint || (isRequired ? 'Required' : '');
  const hasError = Boolean(touched && error);
  const shouldDisplayCountToUse = shouldDisplayCount ?? Boolean(maxLength && maxLength > 0);
  const inputStyles = shouldDisplayCountToUse && inputLengthRef.current
    ? { paddingRight: inputLengthRef.current.clientWidth + 14 }
    : undefined;

  return (
    <div className="text-field">
      {(label || hintToShow) && (
        <div className="text-field__label-wrapper">
          {label && (
            <label
              htmlFor={restProps.id}
              className="text-field__label"
            >
              {label}
            </label>
          )}
          {hintToShow && <span className="text-field__hint">{hintToShow}</span>}
        </div>
      )}
      <div className="text-field__input-wrapper">
        <input
          {...field}
          id={restProps.id}
          type={restProps.type}
          placeholder={restProps.placeholder}
          className={classNames("text-field__input", {
            "text-field__input--error": hasError,
          })}
          style={inputStyles}
        />
        {shouldDisplayCountToUse && (
          <span
            className="text-field__input-length"
            ref={inputLengthRef}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {hasError && <span className="text-field__error">{error}</span>}
    </div>
  );
};

export default TextField;
