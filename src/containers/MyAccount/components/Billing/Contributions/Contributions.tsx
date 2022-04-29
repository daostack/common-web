import React, { FC } from "react";
import { Payment, Subscription } from "@/shared/models";
import { ContributionList } from "../ContributionList";
import "./index.scss";

interface ContributionsProps {
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  commonNames: Record<string, string>;
}

const Contributions: FC<ContributionsProps> = (props) => {
  const { contributions, subscriptions, commonNames } = props;

  return (
    <>
      <ContributionList
        contributions={contributions}
        subscriptions={subscriptions}
        commonNames={commonNames}
      />
    </>
  );
};

export default Contributions;
