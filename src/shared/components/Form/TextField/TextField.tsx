import React from "react";
import classNames from "classnames";
import { useField } from "formik";
import { FieldHookConfig } from "formik/dist/Field";

import "./index.scss";

type TextFieldProps = FieldHookConfig<string> & {
  label?: string;
  isRequired?: boolean;
  hint?: string;
};

const TextField = (props: TextFieldProps) => {
  const { label, isRequired, hint, ...restProps } = props;
  const [field, { touched, error }] = useField(restProps);
  const hintToShow = hint || (isRequired ? 'Required' : '');
  const hasError = Boolean(touched && error);

  return (
    <div className="text-field">
      {(label || hintToShow) && (
        <div className="text-field__label-wrapper">
          {label && (
            <label htmlFor={restProps.id}>
              {label}
            </label>
          )}
          {hintToShow && <span className="text-field__hint">{hintToShow}</span>}
        </div>
      )}
      <input
        {...field}
        id={restProps.id}
        type={restProps.type}
        placeholder={restProps.placeholder}
        className={classNames("text-field__input", {
          "text-field__input--error": hasError,
        })}
      />
      {hasError && <span className="text-field__error">{error}</span>}
    </div>
  );
};

export default TextField;
