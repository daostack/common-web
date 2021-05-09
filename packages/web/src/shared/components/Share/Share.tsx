import React, { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks";
import "./index.scss";

export default function Share() {
  const wrapperRef = useRef(null);
  const [isShown, setShown] = useState(false);
  const { isOutside, setOusideValue } = useOutsideClick(wrapperRef);

  useEffect(() => {
    if (isOutside) {
      setShown(false);
      setOusideValue();
    }
  }, [isOutside, setShown, setOusideValue]);

  return (
    <div className="social-wrapper" ref={wrapperRef}>
      <button className="social-button" onClick={() => setShown(true)} />
      {isShown ? (
        <div className="social-buttons-wrapper">
          <div className="title">Share with</div>
          <div className="social-buttons">
            <button className="facebook"></button>
            <button className="linkedin"></button>
            <button className="telegram"></button>
            <button className="twitter"></button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
