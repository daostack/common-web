import React, { FC } from "react";
import "./index.scss";

const GeneralInfoWrapper: FC = ({ children }) => {
  return (
    <div className="dead-sea-general-info-wrapper">
      <span className="dead-sea-general-info-wrapper__action">Join the</span>
      <h1 className="dead-sea-general-info-wrapper__title">
        Dead Sea Guardians
      </h1>
      {children}
    </div>
  );
};

export default GeneralInfoWrapper;
