import React, { FC } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import classNames from "classnames";
import { ScreenSize, COMMON_SAFETY_DAYS_AMOUNT } from "@/shared/constants";
import { DateFormat } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatDate } from "@/shared/utils";
import "./index.scss";

interface MainCommonInfoProps {
  className?: string;
  commonName: string;
  tagline?: string;
  formattedMinFeeToJoin: string;
}

const MainCommonInfo: FC<MainCommonInfoProps> = (props) => {
  const { commonName, tagline, formattedMinFeeToJoin } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const className = classNames(
    "create-common-review-main-info",
    props.className
  );

  if (isMobileView) {
    const endOfSafetyPeriod = moment().add(COMMON_SAFETY_DAYS_AMOUNT, "days");

    return (
      <div className={className}>
        <div className="create-common-review-main-info__half">
          <div className="create-common-review-main-info__part-wrapper">
            <span className="create-common-review-main-info__value-text">
              Min. Contribution
            </span>
            <span className="create-common-review-main-info__value">
              {formattedMinFeeToJoin}
            </span>
          </div>
        </div>
        <div className="create-common-review-main-info__half">
          <div className="create-common-review-main-info__part-wrapper">
            <span className="create-common-review-main-info__value-text">
              Safety period
            </span>
            <span className="create-common-review-main-info__value">
              <span>{COMMON_SAFETY_DAYS_AMOUNT} days</span>
              <span className="create-common-review-main-info__date">
                {formatDate(endOfSafetyPeriod, DateFormat.FullHuman)}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div>
        <h4 className="create-common-review-main-info__common-name">
          {commonName}
        </h4>
        {tagline && (
          <p className="create-common-review-main-info__tagline">{tagline}</p>
        )}
      </div>
      <div className="create-common-review-main-info__part-wrapper">
        <span className="create-common-review-main-info__value">
          {formattedMinFeeToJoin}
        </span>
        <span className="create-common-review-main-info__value-text">
          Min. Contribution
        </span>
      </div>
    </div>
  );
};

export default MainCommonInfo;
