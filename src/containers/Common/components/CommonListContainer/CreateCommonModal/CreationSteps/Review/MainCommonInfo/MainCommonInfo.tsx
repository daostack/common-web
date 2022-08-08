import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { ScreenSize } from "@/shared/constants";
import { DateFormat } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatDate } from "@/shared/utils";
import "./index.scss";

interface MainCommonInfoProps {
  className?: string;
  commonName: string;
  tagline?: string;
}

const MainCommonInfo: FC<MainCommonInfoProps> = (props) => {
  const { commonName, tagline } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const className = classNames(
    "create-common-review-main-info",
    props.className
  );

  if (isMobileView) {
    return (
      <div className={className}>
        <div className="create-common-review-main-info__part-wrapper">
          <span className="create-common-review-main-info__value-text">
            Safety period
          </span>
          <span className="create-common-review-main-info__value">
            <span>a few seconds</span>
            <span className="create-common-review-main-info__date">
              {formatDate(new Date(), DateFormat.FullHuman)}
            </span>
          </span>
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
    </div>
  );
};

export default MainCommonInfo;
