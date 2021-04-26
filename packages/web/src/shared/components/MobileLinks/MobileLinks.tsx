import React from "react";
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
        onClick={() => window.open("https://apps.apple.com/il/app/common-collaborative-action/id1512785740")}
      />
      <img
        src={`/icons/app-icons/${props.color === "black" ? "google-play.svg" : "google-play-white.svg"}`}
        alt="google-play"
        onClick={() => window.open("https://play.google.com/store/apps/details?id=com.daostack.common")}
      />
    </div>
  );
}
