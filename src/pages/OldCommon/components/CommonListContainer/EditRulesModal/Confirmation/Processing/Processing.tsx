import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { commonTypeText } from "@/shared/utils";
import "./index.scss";

interface Props {
  isSubCommon: boolean;
}

const Processing: FC<Props> = ({ isSubCommon }) => (
  <div className="update-governance-confirmation-processing">
    <img
      className="update-governance-confirmation-processing__image"
      src="/icons/discussions-empty.svg"
      alt="Processing creation request"
    />
    <h2 className="update-governance-confirmation-processing__title">
      Editing your {commonTypeText(isSubCommon)}
    </h2>
    <div className="update-governance-confirmation-processing__loader">
      <Loader />
    </div>
  </div>
);

export default Processing;
