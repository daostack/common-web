import React, { FC } from "react";
import classNames from "classnames";
import { BaseProposal } from "@/shared/models/governance/proposals";
import "./index.scss";

interface ProposalTypeDetailsProps {
  className?: string;
  data: Pick<BaseProposal, "global">;
}

interface ItemProps {
  name: string;
  value: string | number;
  hint?: string;
  hintColor?: "green" | "red";
}

const Item: FC<ItemProps> = (props) => {
  return (
    <>
      <span>{props.name}</span>
      <strong>{props.value}</strong>
      <span
        className={classNames({
          "proposal-type-details__hint--green": props.hintColor === "green",
          "proposal-type-details__hint--red": props.hintColor === "red",
        })}
      >
        {props.hint}
      </span>
    </>
  );
};

const ProposalTypeDetails: FC<ProposalTypeDetailsProps> = (props) => {
  const { className, data } = props;
  const discussionDuration =
    Math.round((data.global.discussionDuration / 24) * 100) / 100;
  const votingDuration =
    Math.round((data.global.votingDuration / 24) * 100) / 100;

  return (
    <div className={classNames("proposal-type-details", className)}>
      <Item name="Quorum" value={`${data.global.quorum}%`} />
      <Item name="Minimum Support" value={`${data.global.minApprove}%`} />
      <Item name="Maximum Object" value={`${data.global.maxReject}%`} />
      <Item name="Discussion Duration" value={discussionDuration} hint="Days" />
      <Item name="Voting Duration" value={votingDuration} hint="Days" />
    </div>
  );
};

export default ProposalTypeDetails;
