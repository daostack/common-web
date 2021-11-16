import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  CSSProperties,
  FC,
  ReactNode,
  RefObject,
} from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { useOutsideClick } from "../../hooks";
import { ModalProps } from "../../interfaces";
import CloseIcon from "../../icons/close.icon";
import LeftArrowIcon from "../../icons/leftArrow.icon";
import { Colors } from "../../constants";
import { ModalContext, FooterOptions, ModalContextValue } from "./context";
import "./index.scss";

const calculateModalStyles = (isSticky: boolean, footerRef: RefObject<HTMLDivElement>): CSSProperties | undefined => {
  if (!footerRef.current || !isSticky) {
    return;
  }

  return {
    paddingBottom: footerRef.current.clientHeight,
  };
};

const calculateFooterStyles = (
  isSticky: boolean,
  wrapperRef: RefObject<HTMLDivElement>,
  footerRef: RefObject<HTMLDivElement>,
): CSSProperties | undefined => {
  if (!wrapperRef.current || !footerRef.current || !isSticky) {
    return;
  }

  return {
    top: wrapperRef.current.clientHeight + wrapperRef.current.offsetTop - footerRef.current.clientHeight,
    left: wrapperRef.current.offsetLeft,
    width: wrapperRef.current.clientWidth,
  };
};

const Modal: FC<ModalProps> = (props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const { isShowing, onGoBack, onClose, children, closeColor, mobileFullScreen, title } = props;
  const [footer, setFooter] = useState<ReactNode>(null);
  const [footerOptions, setFooterOptions] = useState<FooterOptions>({});
  const [modalStyles, setModalStyles] = useState<CSSProperties | undefined>();
  const [footerStyles, setFooterStyles] = useState<CSSProperties | undefined>();
  const [isFullyScrolledToBottom, setIsFullyScrolledToBottom] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const { sticky: isSticky = false } = footerOptions;

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

  const handleScroll = useCallback(() => {
    if (!isSticky) {
      setIsFullyScrolledToBottom(true);
      return;
    }

    const { current } = wrapperRef;

    setIsFullyScrolledToBottom(Boolean(current && (current.clientHeight === current.scrollHeight - current.scrollTop)));
  }, [isSticky]);

  const modalWrapperClassName = classNames("modal-wrapper", {
    "mobile-full-screen": mobileFullScreen,
  });
  const footerClassName = classNames("modal__footer", {
    "modal__footer--fixed": isSticky,
    "modal__footer--shadowed": isSticky && !isFullyScrolledToBottom,
  });

  useLayoutEffect(() => {
    handleScroll();
    setModalStyles(calculateModalStyles(isSticky, footerRef));
    setFooterStyles(calculateFooterStyles(isSticky, wrapperRef, footerRef));
  }, [isSticky, footerRef.current, wrapperRef.current]);

  const contextValue = useMemo<ModalContextValue>(() => ({
    setFooter,
    setFooterOptions,
  }), []);

  return isShowing
    ? ReactDOM.createPortal(
        <div id="modal">
          <div className="modal-overlay" />
          <div className={modalWrapperClassName}>
            <div
              ref={wrapperRef}
              className={`modal box ${props.className}`}
              style={modalStyles}
              onScroll={handleScroll}
            >
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
              {footer && (
                <footer
                  ref={footerRef}
                  className={footerClassName}
                  style={footerStyles}
                >
                  {footer}
                </footer>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
