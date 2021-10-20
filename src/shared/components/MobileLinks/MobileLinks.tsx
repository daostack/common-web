import React from "react";

import { Colors, COMMON_APP_APP_STORE_LINK, COMMON_APP_GOOGLE_PLAY_LINK, MobileOperatingSystem } from "../../constants";
import { getMobileOperatingSystem } from "../../utils";
import "./index.scss";

type IconsColor = Colors.white | Colors.black;

interface IProps {
  color: IconsColor;
  detectOS?: boolean;
}

export default function MobileLinks(props: IProps) {
  const { color, detectOS } = props;

  document.documentElement.style.setProperty("--link-margin-left", detectOS ? "unset" : "10px");

  const appStoreLink = (
    <img
      src={`/icons/app-icons/${color === Colors.black ? "app-store.svg" : "app-store-white.svg"}`}
      alt="app-store"
      onClick={() => window.open(COMMON_APP_APP_STORE_LINK)}
    />
  );

  const googlePlayLink = (
    <img
      src={`/icons/app-icons/${color === Colors.black ? "google-play.svg" : "google-play-white.svg"}`}
      alt="google-play"
      onClick={() => window.open(COMMON_APP_GOOGLE_PLAY_LINK)}
    />
  );

  return (
    <div className="mobile-links-wrapper">
      {detectOS ? (
        getMobileOperatingSystem() === MobileOperatingSystem.iOS ? (
          appStoreLink
        ) : (
          googlePlayLink
        )
      ) : (
        <>
          {appStoreLink}
          {googlePlayLink}
        </>
      )}
    </div>
  );
}
