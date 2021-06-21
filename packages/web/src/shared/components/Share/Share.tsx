import React, { useEffect, useRef, useState } from "react";
import { Colors } from "../../constants";
import { useModal, useOutsideClick } from "../../hooks";
import { Modal } from "../Modal";
import "./index.scss";

type ViewType = "popup" | "modal";

interface IProps {
  color: Colors;
  type: ViewType;
  top?: string;
}

export default function Share(props: IProps) {
  const { color, type, top } = props;
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
        <button className="facebook" />
        <button className="linkedin" />
        <button className="telegram" />
        <button className="twitter" />
      </div>
    </div>
  );

  return (
    <div className="social-wrapper" ref={wrapperRef}>
      <div className="share-button" onClick={handleClick} />
      {type === "popup" && isShown && links}
      {type === "modal" && (
        <Modal isShowing={isShowing} onClose={onClose} closeColor={Colors.black}>
          {links}
        </Modal>
      )}
    </div>
  );
}
