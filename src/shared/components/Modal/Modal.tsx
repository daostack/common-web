import React, { useEffect, useMemo, useRef, useState, FC, ReactNode } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { useOutsideClick } from "../../hooks";
import { ModalProps } from "../../interfaces";
import CloseIcon from "../../icons/close.icon";
import LeftArrowIcon from "../../icons/leftArrow.icon";
import { Colors } from "../../constants";
import { ModalContext, FooterOptions, ModalContextValue } from "./context";
import "./index.scss";

const Modal: FC<ModalProps> = (props) => {
  const wrapperRef = useRef(null);
  const { isShowing, onGoBack, onClose, children, closeColor, mobileFullScreen, title } = props;
  const [footer, setFooter] = useState<ReactNode>(null);
  const [footerOptions, setFooterOptions] = useState<FooterOptions>({});
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

  const modalWrapperClassName = classNames("modal-wrapper", {
    "mobile-full-screen": mobileFullScreen,
  });

  const contextValue = useMemo<ModalContextValue>(() => ({
    setFooter,
    setFooterOptions,
  }), []);

  return isShowing
    ? ReactDOM.createPortal(
        <div id="modal">
          <div className="modal-overlay" />
          <div className={modalWrapperClassName}>
            <div className={`modal box ${props.className}`} ref={wrapperRef}>
              <header className="modal__header">
                {onGoBack && (
                  <div className="modal__action-wrapper modal__back-wrapper" onClick={onGoBack}>
                    <LeftArrowIcon className="modal__back-action" />
                  </div>
                )}
                {typeof title === 'string' ? <h3 className="modal__title">{title}</h3> : title}
                <div className="modal__action-wrapper modal__close-wrapper" onClick={onClose}>
                  <CloseIcon
                    width="24"
                    height="24"
                    fill={closeColor ?? Colors.black}
                  />
                </div>
              </header>
              <ModalContext.Provider value={contextValue}>
                {children}
              </ModalContext.Provider>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
