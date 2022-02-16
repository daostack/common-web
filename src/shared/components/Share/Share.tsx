import React, { useEffect, useRef, useState, PropsWithChildren } from "react";
import classNames from "classnames";

import { Colors } from "../../constants";
import { useModal, useOutsideClick } from "../../hooks";
import { Modal } from "../Modal";
import "./index.scss";

type ViewType = "popup" | "modal";

enum Social {
  Facebook = "facebook",
  Twitter = "twitter",
  LinkedIn = "linkedin",
  Telegram = "telegram",
}

export enum PopupVariant {
  bottomLeft = "bottom-left",
  topCenter = "top-center",
}

interface IProps {
  className?: string;
  url: string;
  color: Colors;
  type: ViewType;
  text?: string;
  top?: string;
  popupVariant?: PopupVariant;
}

const generateShareQuery = (social: Social, { url, text }: { url: string, text?: string }) => {
  switch (social) {
    case Social.Facebook:
      return `?u=${url}${text ? `&quote=${text}` : ""}`;
    case Social.Twitter:
    case Social.Telegram:
      return `?url=${url}${text ? `&text=${text}` : ""}`;
    case Social.LinkedIn:
      return `?url=${url}`;
    default:
      return "";
  }
};

export default function Share(props: PropsWithChildren<IProps>) {
  const {
    className,
    url,
    text = "",
    color,
    type,
    top,
    children,
    popupVariant = PopupVariant.bottomLeft,
  } = props;
  const wrapperRef = useRef(null);
  const [isShown, setShown] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const { isShowing, onOpen, onClose } = useModal(false);
  const queryData = { url, text };
  const isPopup = type === "popup";

  document.documentElement.style.setProperty("--share-button-bg", color);

  useEffect(() => {
    if (type === "popup" && isOutside) {
      setShown(false);
      setOusideValue();
    }
  }, [isOutside, setShown, setOusideValue, type]);

  const handleClick = () => {
    if (type === "modal") {
      onOpen();
    } else {
      setShown(true);
    }
  };

  const links = (
    <div
      className={classNames("social-buttons-wrapper", {
        "social-buttons-wrapper--modal": type === "modal",
        "social-buttons-wrapper--top-center": isPopup && popupVariant === PopupVariant.topCenter,
      })}
      style={{ top: `${top ?? "64px"}` }}
    >
      {type === "popup" && <div className="title">Share with</div>}
      <div
        className={classNames("social-buttons", {
          "social-buttons--modal": type === "modal",
        })}
      >
        <button className="facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php${generateShareQuery(Social.Facebook, queryData)}`)} />
        <button className="twitter" onClick={() => window.open(`https://twitter.com/intent/tweet${generateShareQuery(Social.Twitter, queryData)}`)} />
        <button className="linkedin" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/${generateShareQuery(Social.LinkedIn, queryData)}`)} />
        <button className="telegram" onClick={() => window.open(`https://t.me/share/url${generateShareQuery(Social.Telegram, queryData)}`)} />
      </div>
    </div>
  );

  return (
    <div className={classNames("social-wrapper", className)} ref={wrapperRef}>
      {children ? (
        <div className="social-wrapper__children-wrapper" onClick={handleClick}>
          {children}
        </div>
      ) : (
        <div className="share-button" onClick={handleClick} />
      )}
      {type === "popup" && isShown && links}
      {type === "modal" && (
        <Modal
          className="social-wrapper__modal"
          isShowing={isShowing}
          title="Share with"
          onClose={onClose}
          closeColor={Colors.black}
          closeIconSize={16}
          styles={{
            header: "social-wrapper__modal-header",
            content: "social-wrapper__modal-content",
          }}
        >
          {links}
        </Modal>
      )}
    </div>
  );
}
