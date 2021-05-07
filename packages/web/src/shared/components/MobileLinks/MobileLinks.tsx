import React from "react";
import { COMMON_APP_APP_STORE_LINK, COMMON_APP_GOOGLE_PLAY_LINK } from "../../constants";
import "./index.scss";

type IconsColor = "white" | "black";

interface IProps {
  color: IconsColor;
}

export default function MobileLinks(props: IProps) {
  return (
    <div className="mobile-links-wrapper">
      <img
        src={`/icons/app-icons/${props.color === "black" ? "app-store.svg" : "app-store-white.svg"}`}
        alt="app-store"
        onClick={() => window.open(COMMON_APP_APP_STORE_LINK)}
      />
      <img
        src={`/icons/app-icons/${props.color === "black" ? "google-play.svg" : "google-play-white.svg"}`}
        alt="google-play"
        onClick={() => window.open(COMMON_APP_GOOGLE_PLAY_LINK)}
      />
    </div>
  );
}
