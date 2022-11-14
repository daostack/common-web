import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { commonTypeText } from "@/shared/utils";
import "./index.scss";

interface Props {
  isSubCommonCreation: boolean;
}

const Processing: FC<Props> = ({ isSubCommonCreation }) => (
  <div className="create-common-confirmation-processing">
    <img
      className="create-common-confirmation-processing__image"
      src="/icons/discussions-empty.svg"
      alt="Processing creation request"
    />
    <h2 className="create-common-confirmation-processing__title">
      Creating your {commonTypeText(isSubCommonCreation)}
    </h2>
    <div className="create-common-confirmation-processing__loader">
      <Loader />
    </div>
  </div>
);

export default Processing;
