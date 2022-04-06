import React from "react";
import { Routes } from "../Routes";
import "./index.scss";

export default function Sidebar() {
  return (
    <div className="sidebar-wrapper">
      <span className="route-sub-title sidebar-title">Account</span>
      <Routes />
    </div>
  )
}
