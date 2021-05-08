import "./index.scss";

import React, { useEffect, useRef } from "react";

import ReactDOM from "react-dom";
import { useOutsideClick } from "../../hooks";
import { ModalProps } from "../../interfaces";

const Modal = (props: ModalProps) => {
  const wrapperRef = useRef(null);
  const { isShowing, onClose, children } = props;
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
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
    }
  }, [isShowing]);

  return isShowing
    ? ReactDOM.createPortal(
        <div id="modal">
          <div className="modal-overlay" />
          <div className="modal-wrapper">
            <div className="modal box" ref={wrapperRef}>
              <>
                {children ? (
                  <button className="close-modal" onClick={onClose}>
                    +
                  </button>
                ) : null}
                {children}
              </>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
