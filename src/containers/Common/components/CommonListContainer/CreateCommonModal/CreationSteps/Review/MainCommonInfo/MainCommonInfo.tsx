import React, { FC } from "react";
import "./index.scss";

interface MainCommonInfoProps {
  commonName: string;
  tagline?: string;
  formattedMinFeeToJoin: string;
}

const MainCommonInfo: FC<MainCommonInfoProps> = (props) => {
  const { commonName, tagline, formattedMinFeeToJoin } = props;

  return (
    <div className="create-common-review-main-info">
      <div>
        <h4 className="create-common-review-main-info__common-name">
          {commonName}
        </h4>
        {tagline && (
          <p className="create-common-review-main-info__tagline">{tagline}</p>
        )}
      </div>
      <div className="create-common-review-main-info__price-wrapper">
        <span className="create-common-review-main-info__minimum-contribution">
          {formattedMinFeeToJoin}
        </span>
        <span className="create-common-review-main-info__minimum-contribution-text">
          Min. Contribution
        </span>
      </div>
    </div>
  );
};

export default MainCommonInfo;
