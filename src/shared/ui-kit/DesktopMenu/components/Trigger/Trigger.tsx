import React, {
  cloneElement,
  forwardRef,
  ForwardRefRenderFunction,
  isValidElement,
  MouseEventHandler,
  ReactNode,
} from "react";

type TriggerProps = JSX.IntrinsicElements["button"] & {
  triggerEl: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  shouldPreventDefaultOnClose?: boolean;
};

const Trigger: ForwardRefRenderFunction<HTMLButtonElement, TriggerProps> = (
  props,
  ref,
) => {
  const {
    triggerEl,
    isOpen,
    onClose,
    shouldPreventDefaultOnClose = false,
    ...restProps
  } = props;

  if (!isValidElement(triggerEl)) {
    return <>{triggerEl}</>;
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (restProps.onClick) {
      restProps.onClick(event);
    }
    if (triggerEl.props.onClick) {
      triggerEl.props.onClick(event);
    }
  };

  const handleClickWithPreventDefault: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.preventDefault();
    onClose();
    handleClick(event);
  };

  return cloneElement(triggerEl, {
    ...restProps,
    ...triggerEl.props,
    ref,
    onClick:
      isOpen && shouldPreventDefaultOnClose
        ? handleClickWithPreventDefault
        : handleClick,
  });
};

export default forwardRef(Trigger);
