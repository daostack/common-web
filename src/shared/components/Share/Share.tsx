import React, { useEffect, useRef, useState, PropsWithChildren } from "react";

import { Colors } from "../../constants";
import { useModal, useOutsideClick } from "../../hooks";
import { Modal } from "../Modal";
import "./index.scss";

type ViewType = "popup" | "modal";

interface IProps {
  url: string;
  text: string;
  color: Colors;
  type: ViewType;
  top?: string;
}

export default function Share(props: PropsWithChildren<IProps>) {
  const { url, text, color, type, top, children } = props;
  const wrapperRef = useRef(null);
  const [isShown, setShown] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const { isShowing, onOpen, onClose } = useModal(false);

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
    <div className="social-buttons-wrapper" style={{ top: `${top ?? "64px"}` }}>
      <div className="title">Share with</div>
      <div className="social-buttons">
        <button className="facebook" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}"`)} />
        <button className="linkedin" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`)} />
        <button className="telegram" onClick={() => window.open(`https://t.me/share/url?url=${url}&text=${text}`)} />
        <button className="twitter" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`)} />
      </div>
    </div>
  );

  return (
    <div className="social-wrapper" ref={wrapperRef}>
      {children ? (
        <div className="social-wrapper__children-wrapper" onClick={handleClick}>
          {children}
        </div>
      ) : (
        <div className="share-button" onClick={handleClick} />
      )}
      {type === "popup" && isShown && links}
      {type === "modal" && (
        <Modal isShowing={isShowing} onClose={onClose} closeColor={Colors.black}>
          {links}
        </Modal>
      )}
    </div>
  );
}
