import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Colors, ScreenSize } from "../../constants";
import { useOutsideClick } from "../../hooks";
import { getScreenSize } from "../../store/selectors";
import { Modal } from "../Modal";
import "./index.scss";

export default function Share() {
  const wrapperRef = useRef(null);
  const [isShown, setShown] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);
  const screenSize = useSelector(getScreenSize());

  useEffect(() => {
    if (isOutside) {
      setShown(false);
      setOusideValue();
    }
  }, [isOutside, setShown, setOusideValue]);

  const socialButtons = (
    <div className="social-buttons-wrapper">
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
      <button className="social-button" onClick={() => setShown(true)} />
      {isShown && screenSize === ScreenSize.Desktop ? (
        socialButtons
      ) : (
        <Modal isShowing={isShown} onClose={() => setShown(false)} closeColor={Colors.black}>
          {socialButtons}
        </Modal>
      )}
    </div>
  );
}
