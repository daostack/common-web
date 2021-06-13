import React from "react";
import { useSelector } from "react-redux";
import { MobileLinks } from "../../../../../shared/components/MobileLinks";
import { Colors, ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import "./index.scss";

export default function JoinTheEffortModal() {
  const screenSize = useSelector(getScreenSize());

  return (
    <div className="join-the-effort-wrapper">
      <img src="/icons/logo-all-white.svg" alt="logo" className="logo" />
      <span>
        Download the <b>Common app</b> on your mobile, look for this <br className="desktop-break" /> common, and start
        to make a difference in 2 min!
      </span>
      {screenSize === ScreenSize.Desktop && (
        <div className="qr-code-wrapper">
          <span>Scan to Download app</span>
          <img src="/assets/images/apps-qr.svg" alt="qr code" />
        </div>
      )}
      <MobileLinks color={Colors.black} detectOS={screenSize === ScreenSize.Desktop ? false : true} />
    </div>
  );
}
