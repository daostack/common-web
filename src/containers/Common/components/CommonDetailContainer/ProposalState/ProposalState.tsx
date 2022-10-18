import React from "react";
import classNames from "classnames";
import { Proposal } from "@/shared/models";
import {
  checkIsCountdownState,
  getProposalExpirationDate,
} from "@/shared/utils";
import ProposalCountDown from "../ProposalCountDown/ProposalCountDown";
import { getProposalState } from "./helpers";
import "./index.scss";

interface IProps {
  proposal: Proposal;
  hideCounter?: boolean;
  className?: string;
}

const STATUS_TO_ICON_MAP = {
  Canceled: "rejected",
};

export default function ProposalState({
  proposal,
  hideCounter,
  className,
}: IProps) {
  const state = getProposalState(proposal);
  const isCountdownState = checkIsCountdownState(proposal);

  return (
    <div className={classNames("proposal-state-wrapper", className)}>
      {isCountdownState && (
        <ProposalCountDown
          date={getProposalExpirationDate(proposal)}
          state={proposal.state}
          hideCounter={hideCounter}
        />
      )}
      {!isCountdownState && (
        <div className={`state-wrapper ${state.toLocaleLowerCase()}`}>
          <div className="state-inner-wrapper">
            {state !== "Unclaimed" && (
              <img
                src={`/icons/${
                  STATUS_TO_ICON_MAP[state] || state.toLocaleLowerCase()
                }.svg`}
                alt="proposal state"
              />
            )}
            <span className="state-name">{state}</span>
          </div>
        </div>
      )}
    </div>
  );
}
