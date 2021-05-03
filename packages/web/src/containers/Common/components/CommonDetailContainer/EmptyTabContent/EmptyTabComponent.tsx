import React from "react";
import "./index.scss";

interface EmptyTabComponentProps {
  currentTab: string;
  message: string;
  title: string;
}

export default function EmptyTabComponent({ currentTab, message, title }: EmptyTabComponentProps) {
  return (
    <div className="empty-tab-component-wrapper">
      <div className="img-wrapper">
        {currentTab === "proposals" && <img alt={currentTab} src="/icons/proposals-empty.svg" />}
        {currentTab === "history" && <img alt={currentTab} src="/icons/proposals-empty.svg" />}
        {currentTab === "discussions" && <img alt={currentTab} src="/icons/discussions-empty.s  vg" />}
      </div>
      <div className="empty-tab-content-wrapper ">
        <div className="title">{title}</div>
        <div className="message">{message}</div>
        {currentTab !== "history" && <div className="button-blue">Join The efforts</div>}
      </div>
    </div>
  );
}
