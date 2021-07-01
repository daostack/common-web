import React from "react";
import { Common } from "../../../../../shared/models";
import "./index.scss";

interface AboutSidebarComponentProps {
  title: string;
  common: Common;
  vievAllHandler: () => void;
}

export default function AboutSidebarComponent({ title, vievAllHandler, common }: AboutSidebarComponentProps) {
  return common?.description ? (
    <div className="about-sidebar-wrapper">
      <div className="title-wrapper">
        <div className="title">{title}</div>
        <div className="view-all" onClick={vievAllHandler}>
          View full agenda
        </div>
      </div>
      <div className="information-content">{common.description}</div>
    </div>
  ) : null;
}
