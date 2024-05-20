import React, { useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectGovernance } from "@/pages/OldCommon/store/selectors";
import { ProposalsTypes } from "@/shared/constants";
import { AllowedActions, AllowedProposals } from "@/shared/models";
import { getTextForProposalType } from "@/shared/utils";
import { generateCirclesBinaryNumber } from "../../utils";
import { getTextForAction, checkShouldRemoveAction } from "./helpers";
import "./index.scss";

interface Props {
  isSubCommon: boolean;
}

export default function WhitepaperMembers({ isSubCommon }: Props) {
  const governance = useSelector(selectGovernance());
  const [selectedMember, setSelectedMember] = useState({
    ...governance?.circles[0],
    index: 0,
  });

  const members = Object.values(governance?.circles || {})
    .slice(0, 5)
    .map((circle, index) => (
      <li
        key={index}
        onClick={() => setSelectedMember({ ...circle, index })}
        className={classNames({
          active: selectedMember?.name === circle.name,
        })}
      >
        {circle.name}
      </li>
    ));

  const renderContent = () => {
    const circle = Object.values(governance?.circles || {}).filter(
      (circle) => circle.name === selectedMember?.name,
    )[0];

    const allowedProposals = Object.keys(circle?.allowedProposals || {})
      .map((proposalType) =>
        getTextForProposalType(
          proposalType as keyof AllowedProposals,
          isSubCommon,
        ),
      )
      .sort()
      .map((text, index) => (
        <span key={index} className="whitepaper-members__feature-title">
          <img
            src="/icons/check.png"
            className="whitepaper-members__checkmark-icon"
            alt="checkmark"
          />
          {text}
        </span>
      ));

    const allowedActions = Object.keys(circle?.allowedActions || {})
      .filter(
        (action) => !checkShouldRemoveAction(action as keyof AllowedActions),
      )
      .map((action) =>
        getTextForAction(action as keyof AllowedActions, isSubCommon),
      )
      .sort()
      .map((text, index) => (
        <span key={index} className="whitepaper-members__feature-title">
          <img
            src="/icons/check.png"
            className="whitepaper-members__checkmark-icon"
            alt="checkmark"
          />
          {text}
        </span>
      ));

    const allowedVotes = Object.keys(governance?.proposals || {})
      .filter((proposal) => {
        const circleBin = generateCirclesBinaryNumber([selectedMember.index]);

        if (
          proposal === ProposalsTypes.ASSIGN_CIRCLE ||
          proposal === ProposalsTypes.REMOVE_CIRCLE
        ) {
          return Object.keys(governance?.proposals[proposal] || {}).find(
            (key) => {
              const obj = governance?.proposals[proposal] || {};

              return obj[key]?.global?.weights?.find(
                ({ circles }) => circles.bin & circleBin,
              );
            },
          );
        }

        if (
          governance?.proposals[proposal]?.global?.weights?.find(
            ({ circles }) => circles.bin & circleBin,
          )
        ) {
          return true;
        }
      })
      .map((proposalType) =>
        getTextForProposalType(
          proposalType as keyof AllowedProposals,
          isSubCommon,
        ),
      )
      .sort()
      .map((proposalKey, index) => {
        return (
          <span key={index} className="whitepaper-members__feature-title">
            <img
              src="/icons/check.png"
              className="whitepaper-members__checkmark-icon"
              alt="checkmark"
            />
            {proposalKey}
          </span>
        );
      });

    return (
      <div className="whitepaper-members__content">
        <div className="whitepaper-members__sub-title">Proposal Creation</div>
        {allowedProposals}
        {Boolean(allowedVotes.length) && (
          <div className="whitepaper-members__sub-title">Proposal Voting</div>
        )}
        {allowedVotes}
        <div className="whitepaper-members__sub-title">Other Actions</div>
        {allowedActions}
      </div>
    );
  };

  return (
    <div className="whitepaper-members-wrapper">
      <ul className="whitepaper-members__members-select">{members}</ul>
      {renderContent()}
    </div>
  );
}
