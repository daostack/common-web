import "./index.scss";

import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import { useOutsideClick } from "../../hooks";
import { ModalProps } from "../../interfaces";
import CloseIcon from "../../icons/close.icon";
import LeftArrowIcon from "../../icons/leftArrow.icon";
import { Colors } from "../../constants";
import classNames from "classnames";

const Modal = (props: ModalProps) => {
  const wrapperRef = useRef(null);
  const { isShowing, onGoBack, onClose, children, closeColor, mobileFullScreen } = props;
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);

  useEffect(() => {
    if (isOutside) {
      onClose();
      setOusideValue();
    }
  }, [isOutside, onClose, setOusideValue]);

  useEffect(() => {
    if (!isShowing) {
      const modalRoot = document.getElementById("modal");
      document.body.style.overflow = "initial";
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isShowing]);

  const modalWrapperClassName = classNames({
    "modal-wrapper": true,
    "mobile-full-screen": mobileFullScreen,
  });

  return isShowing
    ? ReactDOM.createPortal(
        <div id="modal">
          <div className="modal-overlay" />
          <div className={modalWrapperClassName}>
            <div className={`modal box ${props.className}`} ref={wrapperRef}>
              <div className="modal__header">
                {onGoBack && (
                  <div className="modal__action-wrapper modal__back-wrapper" onClick={onGoBack}>
                    <LeftArrowIcon className="modal__back-action" />
                  </div>
                )}
                <div className="modal__action-wrapper modal__close-wrapper" onClick={onClose}>
                  <CloseIcon
                    width="24"
                    height="24"
                    fill={closeColor ?? Colors.black}
                  />
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
