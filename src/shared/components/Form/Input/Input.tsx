import React, {
  useState,
  ChangeEventHandler,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
  useRef,
} from "react";
import classNames from "classnames";
import { useZoomDisabling } from "@/shared/hooks";
import { ErrorText } from "../ErrorText";
import "./index.scss";

interface InputStyles {
  label?: string;
  hint?: string;
  description?: string;
  labelWrapper?: string;
  input?: {
    default?: string;
  };
  inputWrapper?: string;
  error?: string;
}

type InputProps = Omit<JSX.IntrinsicElements["input"], "ref"> & {
  isTextarea?: false;
};
type TextareaProps = Omit<JSX.IntrinsicElements["textarea"], "ref"> & {
  isTextarea: true;
};
type FilterExtraPropsFunction = {
  (props: InputProps): JSX.IntrinsicElements["input"];
  (props: TextareaProps): JSX.IntrinsicElements["textarea"];
};
export type FullInputProps = (InputProps | TextareaProps) & {
  name: string;
  className?: string;
  label?: string;
  description?: string;
  hint?: string;
  maxLength?: number;
  shouldDisplayCount?: boolean;
  countAsHint?: boolean;
  error?: string;
  styles?: InputStyles;
};

export interface InputRef {
  focus: () => void;
}

const filterExtraProps: FilterExtraPropsFunction = <
  T extends InputProps | TextareaProps,
>(
  props: T,
) => {
  const { isTextarea: _, ...restProps } = props;

  return restProps;
};

const isChangeAllowed = (value: string, maxLength?: number): boolean =>
  !maxLength || value.length <= maxLength;

const Input: ForwardRefRenderFunction<InputRef, FullInputProps> = (
  props,
  inputRef,
) => {
  const {
    className,
    label,
    description,
    maxLength,
    shouldDisplayCount,
    countAsHint = false,
    error,
    styles,
    ...restProps
  } = props;
  const innerInputRef = useRef<HTMLInputElement>(null);
  const innerRef = useRef<HTMLTextAreaElement>(null);

  const [inputLengthRef, setInputLengthRef] = useState<HTMLSpanElement | null>(
    null,
  );
  useZoomDisabling();
  const id = restProps.id || restProps.name;
  const currentLength =
    typeof restProps.value === "string" ? restProps.value.length : 0;
  const hint =
    props.hint || (countAsHint ? `${currentLength}/${maxLength}` : "");
  const shouldDisplayCountToUse =
    shouldDisplayCount ?? Boolean(maxLength && maxLength > 0);
  const inputStyles =
    shouldDisplayCountToUse && inputLengthRef
      ? { paddingRight: inputLengthRef.clientWidth + 14 }
      : undefined;
  const inputClassName = classNames(
    "custom-input__input",
    styles?.input?.default,
    {
      "custom-input__input--textarea": restProps.isTextarea,
      "custom-input__input--error": error,
    },
  );
  const generalInputProps = {
    id,
    className: inputClassName,
    style: inputStyles,
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (
      props.onChange &&
      !props.isTextarea &&
      isChangeAllowed(event.target.value, maxLength)
    ) {
      props.onChange(event);
    }
  };
  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    if (
      props.onChange &&
      props.isTextarea &&
      isChangeAllowed(event.target.value, maxLength)
    ) {
      props.onChange(event);
    }
  };

  useImperativeHandle(
    inputRef,
    () => ({
      focus: () => {
        innerInputRef?.current?.focus();
        innerRef?.current?.focus();
      },
    }),
    [],
  );

  return (
    <div className={classNames("custom-input", className)}>
      {(label || hint) && (
        <div
          className={classNames(
            "custom-input__label-wrapper",
            styles?.labelWrapper,
          )}
        >
          {label && (
            <label
              htmlFor={id}
              className={classNames("custom-input__label", styles?.label)}
            >
              {label}
            </label>
          )}
          {hint && (
            <span className={classNames("custom-input__hint", styles?.hint)}>
              {hint}
            </span>
          )}
        </div>
      )}
      {description && (
        <p
          className={classNames(
            "custom-input__description",
            styles?.description,
          )}
        >
          {description}
        </p>
      )}
      <div
        className={classNames(
          "custom-input__input-wrapper",
          styles?.inputWrapper,
        )}
      >
        {!restProps.isTextarea && (
          <input
            {...filterExtraProps(restProps)}
            {...generalInputProps}
            ref={innerInputRef}
            onChange={handleInputChange}
          />
        )}
        {restProps.isTextarea && (
          <textarea
            ref={innerRef}
            {...filterExtraProps(restProps)}
            {...generalInputProps}
            onChange={handleTextareaChange}
            />
        )}
        {shouldDisplayCountToUse && !countAsHint && (
          <span className="custom-input__input-length" ref={setInputLengthRef}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      {Boolean(error) && (
        <ErrorText className={styles?.error}>{error}</ErrorText>
      )}
    </div>
  );
};

export default forwardRef(Input);
