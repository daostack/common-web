import React, { FC } from "react";
import "./index.scss";

interface ContributionListProps {}

const ContributionList: FC<ContributionListProps> = (props) => {
  const {} = props;

  return (
    <div className="billing-contribution-list">
      {false ? (
        <div className="billing-contribution-list__empty-hint">
          <img
            className="billing-contribution-list__empty-hint-image"
            src="/assets/images/membership-request-funds.svg"
            alt="No contributions"
          />
          <p className="billing-contribution-list__empty-hint-text">
            You don’t have any active contributions yet.
          </p>
        </div>
      ) : (
        <div className="billing-contribution-list__content">
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
          123<br/>
        </div>
      )}
    </div>
  );
};

export default ContributionList;
