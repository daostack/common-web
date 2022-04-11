import React from "react";
import { Routes } from "../Routes";
import "./index.scss";

export default function Sidebar() {
  return (
    <div className="general-sidebar-wrapper">
      <span className="route-sub-title general-sidebar-wrapper__title">
        Account
      </span>
      <Routes />
    </div>
  );
}
