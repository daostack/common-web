import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactNode,
} from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { useComponentWillUnmount } from "../../hooks";
import { ModalProps, ModalRef, ModalType } from "../../interfaces";
import CloseIcon from "../../icons/close.icon";
import LeftArrowIcon from "../../icons/leftArrow.icon";
import { Colors } from "../../constants";
import { ModalContext, FooterOptions, ModalContextValue } from "./context";
import { ClosePrompt } from "./components/ClosePrompt";
import "./index.scss";

const Modal: ForwardRefRenderFunction<ModalRef, ModalProps> = (
  props,
  modalRef
) => {
  const {
    isShowing,
    onGoBack,
    onClose,
    children,
    closeColor,
    mobileFullScreen,
    title,
    onHeaderScrolledToTop,
    styles,
    type = ModalType.Default,
    hideCloseButton = false,
    closeIconSize = 24,
    isHeaderSticky = false,
    shouldShowHeaderShadow = true,
    closePrompt = false,
    withoutHorizontalPadding = false,
  } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const [footer, setFooter] = useState<ReactNode>(null);
  const [footerOptions, setFooterOptions] = useState<FooterOptions>({});
  const [headerContent, setHeaderContent] = useState<ReactNode>(null);
  const [isFullyScrolledToTop, setIsFullyScrolledToTop] = useState(true);
  const [isFullyScrolledToBottom, setIsFullyScrolledToBottom] = useState(false);
  const { sticky: isFooterSticky = false } = footerOptions;
  const [showClosePrompt, setShowClosePrompt] = useState(false);
  const modalId = useMemo(() => `modal-${uuidv4()}`, []);

  const handleModalContainerClick: MouseEventHandler = (event) => {
    event.stopPropagation();
  };

  const handleClose = useCallback(() => {
    if (closePrompt) {
      setShowClosePrompt(true);
    } else {
      onClose();
    }
  }, [closePrompt, onClose]);

  const handleClosePromptContinue = useCallback(() => {
    setShowClosePrompt(false);
  }, []);

  const handleClosePromptClose = useCallback(() => {
    setShowClosePrompt(false);
    onClose();
  }, [onClose]);

  const handleUnmount = useCallback(() => {
    if (!isShowing) {
      return;
    }

    const modalRoot = document.getElementById(modalId);
    document.body.style.overflow = "initial";

    if (modalRoot) {
      document.body.removeChild(modalRoot);
    }
  }, [isShowing, modalId]);

  useEffect(() => {
    if (!isShowing) {
      const modalRoot = document.getElementById(modalId);
      document.body.style.overflow = "initial";
      if (modalRoot) {
        document.body.removeChild(modalRoot);
      }
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isShowing, modalId]);

  useEffect(() => {
    if (onHeaderScrolledToTop) {
      onHeaderScrolledToTop(!isHeaderSticky || isFullyScrolledToTop);
    }
  }, [onHeaderScrolledToTop, isHeaderSticky, isFullyScrolledToTop]);

  useComponentWillUnmount(handleUnmount);

  const handleScroll = useCallback(() => {
    const { current } = contentRef;

    setIsFullyScrolledToTop(
      !isHeaderSticky || Boolean(current && current.scrollTop === 0)
    );
    setIsFullyScrolledToBottom(
      !isFooterSticky ||
        Boolean(
          current &&
            current.clientHeight + 1 >= current.scrollHeight - current.scrollTop
        )
    );
  }, [isHeaderSticky, isFooterSticky]);

  const modalWrapperClassName = classNames("modal-wrapper", styles?.modalWrapper);
  const modalClassName = classNames("modal", props.className, {
    "modal--mobile-full-screen": mobileFullScreen && type !== ModalType.MobilePopUp,
    "modal--mobile-pop-up": type === ModalType.MobilePopUp,
  });
  const headerWrapperClassName = classNames(
    "modal__header-wrapper",
    styles?.headerWrapper,
    {
      "modal__header-wrapper--with-modal-padding": isHeaderSticky || withoutHorizontalPadding,
      "modal__header-wrapper--shadowed":
        isHeaderSticky && !isFullyScrolledToTop && shouldShowHeaderShadow,
    }
  );
  const headerClassName = classNames("modal__header", styles?.header, {
    "modal__header--default-padding": !title,
    "modal__header--with-string-title": title && typeof title === "string",
  });
  const modalContentClassName = classNames("modal__content", styles?.content, {
    "modal__content--without-footer": !footer,
    "modal__content--without-h-padding": withoutHorizontalPadding,
  });
  const footerClassName = classNames("modal__footer", {
    "modal__footer--fixed": isFooterSticky,
    "modal__footer--shadowed": isFooterSticky && !isFullyScrolledToBottom,
  });

  const headerEl = (
    <header className={headerWrapperClassName}>
      <div className={headerClassName}>
        {onGoBack && (
          <div
            className="modal__action-wrapper modal__back-wrapper"
            onClick={onGoBack}
          >
            <LeftArrowIcon className="modal__back-action" />
          </div>
        )}
        {typeof title === "string" ? (
          <h3 className="modal__title">{title}</h3>
        ) : (
          title
        )}
        {!hideCloseButton && (
          <div
            className={classNames(
              "modal__action-wrapper modal__close-wrapper",
              styles?.closeWrapper
            )}
            onClick={handleClose}
          >
            <CloseIcon
              width={closeIconSize}
              height={closeIconSize}
              fill={closeColor ?? Colors.black}
            />
          </div>
        )}
      </div>
      {headerContent}
    </header>
  );
  const footerEl = footer && (
    <footer className={footerClassName}>{footer}</footer>
  );

  useImperativeHandle(modalRef, () => ({
    scrollToTop: () => {
      if (contentRef.current) {
        contentRef.current.scrollTo({
          top: 0,
        });
      }
    },
  }), []);

  useLayoutEffect(() => {
    handleScroll();
  }, [handleScroll, isHeaderSticky, headerContent, isFooterSticky, footer]);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      setFooter,
      setFooterOptions,
      setHeaderContent,
    }),
    []
  );

  return isShowing
    ? ReactDOM.createPortal(
        <div id={modalId}>
          <div className="modal-overlay" />
          <div className={modalWrapperClassName} onClick={handleClose}>
            <div
              className={modalClassName}
              onClick={handleModalContainerClick}
            >
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
              {showClosePrompt && (
                <ClosePrompt
                  onClose={handleClosePromptClose}
                  onContinue={handleClosePromptContinue}
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

export default forwardRef(Modal);
