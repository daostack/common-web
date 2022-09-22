import React, { FC } from "react";
import { Loader } from "@/shared/components";
import "./index.scss";

const Processing: FC = () => (
  <div className="update-common-confirmation-processing">
    <img
      className="update-common-confirmation-processing__image"
      src="/icons/discussions-empty.svg"
      alt="Processing creation request"
    />
    <h2 className="update-common-confirmation-processing__title">
      Editing your Common
    </h2>
    <div className="update-common-confirmation-processing__loader">
      <Loader />
    </div>
  </div>
);

export default Processing;
