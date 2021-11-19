import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  FC,
  ReactNode,
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

const Modal: FC<ModalProps> = (props) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isShowing, onGoBack, onClose, children, closeColor, mobileFullScreen, title, isHeaderSticky = false } = props;
  const [footer, setFooter] = useState<ReactNode>(null);
  const [footerOptions, setFooterOptions] = useState<FooterOptions>({});
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);
  const [isFullyScrolledToTop, setIsFullyScrolledToTop] = useState(true);
  const [isFullyScrolledToBottom, setIsFullyScrolledToBottom] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const { sticky: isFooterSticky = false } = footerOptions;

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
    const { current } = contentRef;

    setIsFullyScrolledToTop(!isHeaderSticky || Boolean(current && current.scrollTop === 0));
    setIsFullyScrolledToBottom((
      !isFooterSticky
      || Boolean(current && (current.clientHeight === current.scrollHeight - current.scrollTop))
    ));
  }, [isHeaderSticky, isFooterSticky]);

  const modalWrapperClassName = classNames("modal-wrapper", {
    "mobile-full-screen": mobileFullScreen,
  });
  const headerWrapperClassName = classNames("modal__header-wrapper", {
    "modal__header-wrapper--fixed": isHeaderSticky,
    "modal__header-wrapper--shadowed": isHeaderSticky && !isFullyScrolledToTop,
  });
  const headerClassName = classNames("modal__header", {
    "modal__header--default-padding": !title,
    "modal__header--with-string-title": title && typeof title === 'string',
  });
  const modalContentClassName = classNames("modal__content", {
    "modal__content--without-footer": !footer,
  });
  const footerClassName = classNames("modal__footer", {
    "modal__footer--fixed": isFooterSticky,
    "modal__footer--shadowed": isFooterSticky && !isFullyScrolledToBottom,
  });

  const headerEl = (
    <header className={headerWrapperClassName}>
      <div className={headerClassName}>
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
      </div>
      {headerContent}
    </header>
  );
  const footerEl = footer && (
    <footer className={footerClassName}>
      {footer}
    </footer>
  );

  useLayoutEffect(() => {
    handleScroll();
  }, [isHeaderSticky, headerContent, isFooterSticky, footer, contentRef.current]);

  const contextValue = useMemo<ModalContextValue>(() => ({
    setFooter,
    setFooterOptions,
    setHeaderContent,
  }), []);

  return isShowing
    ? ReactDOM.createPortal(
        <div id="modal">
          <div className="modal-overlay" />
          <div className={modalWrapperClassName}>
            <div ref={wrapperRef} className={`modal ${props.className}`}>
              {isHeaderSticky && headerEl}
              <ModalContext.Provider value={contextValue}>
                <div
                  ref={contentRef}
                  className={modalContentClassName}
                  onScroll={handleScroll}
                >
                  {!isHeaderSticky && headerEl}
                  {children}
                  {!isFooterSticky && footerEl}
                </div>
              </ModalContext.Provider>
              {isFooterSticky && footerEl}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default Modal;
