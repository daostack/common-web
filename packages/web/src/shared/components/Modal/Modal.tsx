import "./index.scss";

import React, { useEffect, useRef } from "react";

import ReactDOM from "react-dom";
import { useOutsideClick } from "../../hooks";
import { ModalProps } from "../../interfaces";
import CloseIcon from "../../icons/close.icon";
import { Colors } from "../../constants";

const Modal = (props: ModalProps) => {
  const wrapperRef = useRef(null);
  const { isShowing, onClose, children, closeColor } = props;
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

  return isShowing
    ? ReactDOM.createPortal(
        <div id="modal">
          <div className="modal-overlay" />
          <div className="modal-wrapper">
            <div className={`modal box ${props.className}`} ref={wrapperRef}>
              <div className="close-wrapper" onClick={() => onClose()}>
                <CloseIcon fill={closeColor ?? Colors.black} />
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
