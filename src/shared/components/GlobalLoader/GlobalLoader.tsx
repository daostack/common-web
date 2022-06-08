import React, { FC } from "react";
import { GlobalOverlay } from "../GlobalOverlay";
import { Loader } from "../Loader";
import "./index.scss";

const GlobalLoader: FC = () => (
  <GlobalOverlay className="global-loader-overlay">
    <div className="global-loader-wrapper">
      <Loader className="global-loader" />
    </div>
  </GlobalOverlay>
);

export default GlobalLoader;
