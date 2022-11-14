import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { commonTypeText } from "@/shared/utils";
import "./index.scss";

interface Props {
  isSubCommonCreation: boolean;
}

const Processing: FC<Props> = ({ isSubCommonCreation }) => (
  <div className="update-common-confirmation-processing">
    <img
      className="update-common-confirmation-processing__image"
      src="/icons/discussions-empty.svg"
      alt="Processing creation request"
    />
    <h2 className="update-common-confirmation-processing__title">
      Editing your {commonTypeText(isSubCommonCreation)}
    </h2>
    <div className="update-common-confirmation-processing__loader">
      <Loader />
    </div>
  </div>
);

export default Processing;
