import React, { FC, useMemo } from "react";
import classNames from "classnames";
import { BaseProposal } from "@/shared/models/governance/proposals";
import "./index.scss";
import { Circles } from "@/shared/models";
import { calculateVoters } from "../../../CommonWhitepaper/utils";

interface ProposalTypeDetailsProps {
  className?: string;
  data: Pick<BaseProposal, "global">;
  circles: Circles
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
  const { className, data, circles } = props;
  const discussionDuration =
    Math.round((data.global.discussionDuration / 24) * 100) / 100;
  const votingDuration =
    Math.round((data.global.votingDuration / 24) * 100) / 100;

  const voters = useMemo(() => {
    if(!circles || !data.global.weights) {
      return '';
    }

    return calculateVoters(data.global.weights, circles)?.map((voter) => voter).join(', ');
  },[circles, data.global.weights]);

  return (
    <div className={classNames("proposal-type-details", className)}>
      {voters && <Item name="Voters" value={voters} />}
      <Item name="Quorum" value={`${data.global.quorum}%`} />
      <Item name="Minimum Support" value={`${data.global.minApprove}%`} />
      <Item name="Maximum Object" value={`${data.global.maxReject}%`} />
      <Item name="Discussion Duration" value={discussionDuration} hint="Days" />
      <Item name="Voting Duration" value={votingDuration} hint="Days" />
    </div>
  );
};

export default ProposalTypeDetails;
