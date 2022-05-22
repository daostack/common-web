import React, { useEffect, useRef, useState, PropsWithChildren } from "react";
import classNames from "classnames";
import { SocialLinks, ShareModal } from "@/shared/components";
import {
  Colors,
  ShareViewType,
  SharePopupVariant,
} from "@/shared/constants";
import { useModal, useOutsideClick } from "../../hooks";
import "./index.scss";

export interface IProps {
  className?: string;
  shareButtonClassName?: string;
  url: string;
  color: Colors;
  type: ShareViewType;
  text?: string;
  top?: string;
  popupVariant?: SharePopupVariant;
  isLoading?: boolean;
  onOpen?: () => void;
  withBorder?: boolean;
}

export default function Share(props: PropsWithChildren<IProps>) {
  const {
    className,
    shareButtonClassName,
    url,
    text = "",
    color,
    type,
    top,
    children,
    popupVariant = SharePopupVariant.BottomLeft,
    isLoading = false,
    withBorder = false,
  } = props;
  const wrapperRef = useRef(null);
  const [isShown, setShown] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const { isShowing, onOpen, onClose } = useModal(false);

  document.documentElement.style.setProperty("--share-button-bg", color);

  useEffect(() => {
    if (type === ShareViewType.Popup && isOutside) {
      setShown(false);
      setOusideValue();
    }
  }, [isOutside, setShown, setOusideValue, type]);

  const handleClick = () => {
    if (type !== ShareViewType.Popup) {
      onOpen();
    } else {
      setShown(true);
    }
    if (props.onOpen) {
      props.onOpen();
    }
  };

  return (
    <div className={classNames("social-wrapper", className)} ref={wrapperRef}>
      {children ? (
        <div className="social-wrapper__children-wrapper" onClick={handleClick}>
          {children}
        </div>
      ) : (
        <div
          className={classNames("share-button", shareButtonClassName, {
            "share-button__with-border": withBorder,
          })}
          onClick={handleClick}
        />
      )}
      {
        (type === ShareViewType.Popup)
        ? (
            isShown && <SocialLinks
              shareViewType={type}
              sourceUrl={url}
              isLoading={isLoading}
              popupVariant={popupVariant}
              top={top}
              linkText={text}
            />
        )
        : (
            <ShareModal
              isShowing={isShowing}
              isLoading={isLoading}
              sourceUrl={url}
              onClose={onClose}
              type={type}
            />
        )
      }
    </div>
  );
}
