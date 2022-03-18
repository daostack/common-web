import React, { useEffect, useRef, useState, PropsWithChildren } from "react";
import classNames from "classnames";
import { Loader } from "@/shared/components";
import { isMobile } from "@/shared/utils";
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

export interface IProps {
  className?: string;
  url: string;
  color: Colors;
  type: ViewType;
  text?: string;
  top?: string;
  popupVariant?: PopupVariant;
  isLoading?: boolean;
  onOpen?: () => void;
}

const SOCIAL_LINKS: Record<Social, string> = {
  [Social.Facebook]: "https://www.facebook.com/sharer/sharer.php",
  [Social.Telegram]: "https://t.me/share/url",
  [Social.Twitter]: "https://twitter.com/intent/tweet",
  [Social.LinkedIn]: "https://www.linkedin.com/sharing/share-offsite",
};

const generateShareQuery = (
  social: Social,
  { url, text }: { url: string; text?: string }
) => {
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

const getSocialURL = (social: Social, query: string): string =>
  `${SOCIAL_LINKS[social]}${query}`;

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
    isLoading = false,
  } = props;
  const wrapperRef = useRef(null);
  const [isShown, setShown] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const { isShowing, onOpen, onClose } = useModal(false);
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
    if (props.onOpen) {
      props.onOpen();
    }
  };

  const shareNatively = async () => {
    if (!navigator?.share) {
      return;
    }

    try {
      await navigator.share({
        url,
        text,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleURLOpen = async (social: Social) => {
    if (isMobile() && navigator && Boolean(navigator.share)) {
      await shareNatively();
      return;
    }

    const queryData = { url, text };
    const query = generateShareQuery(social, queryData);
    const socialURL = getSocialURL(social, query);

    window.open(socialURL);
  };

  const links = (
    <div
      className={classNames("social-buttons-wrapper", {
        "social-buttons-wrapper--modal": type === "modal",
        "social-buttons-wrapper--top-center":
          isPopup && popupVariant === PopupVariant.topCenter,
        "social-buttons-wrapper--loading": isLoading,
      })}
      style={{ top: `${top ?? "64px"}` }}
    >
      {type === "popup" && <div className="title">Share with</div>}
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={classNames("social-buttons", {
            "social-buttons--modal": type === "modal",
          })}
        >
          <button
            className="facebook"
            onClick={() => handleURLOpen(Social.Facebook)}
          />
          <button
            className="twitter"
            onClick={() => handleURLOpen(Social.Twitter)}
          />
          <button
            className="linkedin"
            onClick={() => handleURLOpen(Social.LinkedIn)}
          />
          <button
            className="telegram"
            onClick={() => handleURLOpen(Social.Telegram)}
          />
        </div>
      )}
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
