import React, { useState, FC } from "react";
import classNames from "classnames";
import { useField } from "formik";
import { FieldHookConfig } from "formik/dist/Field";

import "./index.scss";

interface Styles {
  input?: {
    default?: string;
  };
}

type TextFieldProps = FieldHookConfig<string> & {
  name: string;
  className?: string;
  label?: string;
  isRequired?: boolean;
  hint?: string;
  maxLength?: number;
  shouldDisplayCount?: boolean;
  rows?: number;
  styles?: Styles;
};

const getTextFieldSpecificProps = (props: TextFieldProps) => (
  props.as === 'textarea'
    ? { rows: props.rows }
    : { type: props.type }
);

const TextField: FC<TextFieldProps> = (props) => {
  const { className, label, isRequired, hint, maxLength, shouldDisplayCount, rows, styles, ...restProps } = props;
  const [field, { value = '', touched, error }] = useField(restProps);
  const [inputLengthRef, setInputLengthRef] = useState<HTMLSpanElement | null>(null);
  const id = restProps.id || restProps.name;
  const hintToShow = hint || (isRequired ? 'Required' : '');
  const hasError = Boolean(touched && error);
  const shouldDisplayCountToUse = shouldDisplayCount ?? Boolean(maxLength && maxLength > 0);
  const inputStyles = shouldDisplayCountToUse && inputLengthRef
    ? { paddingRight: inputLengthRef.clientWidth + 14 }
    : undefined;
  const isTextarea = restProps.as === 'textarea';
  const TextFieldTag = isTextarea ? 'textarea' : 'input';

  return (
    <div className={classNames("text-field", className)}>
      {(label || hintToShow) && (
        <div className="text-field__label-wrapper">
          {label && (
            <label
              htmlFor={id}
              className="text-field__label"
            >
              {label}
            </label>
          )}
          {hintToShow && <span className="text-field__hint">{hintToShow}</span>}
        </div>
      )}
      <div className="text-field__input-wrapper">
        <TextFieldTag
          {...field}
          id={id}
          placeholder={restProps.placeholder}
          className={classNames("text-field__input", styles?.input?.default, {
            "text-field__input--error": hasError,
          })}
          style={inputStyles}
          {...getTextFieldSpecificProps(props)}
        />
        {shouldDisplayCountToUse && (
          <span
            className="text-field__input-length"
            ref={setInputLengthRef}
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
