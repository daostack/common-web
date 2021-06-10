import React from "react";
import { COMMON_APP_APP_STORE_LINK, COMMON_APP_GOOGLE_PLAY_LINK, MobileOperatingSystem } from "../../constants";
import CloseIcon from "../../icons/close.icon";
import { getMobileOperatingSystem } from "../../utils";
import "./index.scss";

interface IProps {
  setHasClosedPopup: Function;
  inMenu?: boolean;
}

export default function DownloadCommonApp(props: IProps) {
  return (
    <div className={props.inMenu ? "download-common-app-wrapper in-menu" : "download-common-app-wrapper"}>
      <div
        className="icon-text-wrapper"
        onClick={() =>
          window.open(
            getMobileOperatingSystem() === MobileOperatingSystem.iOS
              ? COMMON_APP_APP_STORE_LINK
              : COMMON_APP_GOOGLE_PLAY_LINK,
          )
        }
      >
        <img src="/icons/common-icon-round-corners.svg" alt="Common app logo" />
        {!props.inMenu ? (
          <span className="text">
            Download now
            <br />
            <b>Common app</b>
          </span>
        ) : (
          <span className="text">Download Common app</span>
        )}
      </div>
      <div className="download-close-buttons">
        <img
          src="/icons/download.svg"
          alt="download"
          onClick={() =>
            window.open(
              getMobileOperatingSystem() === MobileOperatingSystem.iOS
                ? COMMON_APP_APP_STORE_LINK
                : COMMON_APP_GOOGLE_PLAY_LINK,
            )
          }
        />
        {!props.inMenu && (
          <div
            className="close-icon-wrapper"
            onClick={() => {
              props.setHasClosedPopup("true");
              sessionStorage.setItem("hasClosedPopup", "true");
            }}
          >
            <CloseIcon />
          </div>
        )}
      </div>
    </div>
  );
}
