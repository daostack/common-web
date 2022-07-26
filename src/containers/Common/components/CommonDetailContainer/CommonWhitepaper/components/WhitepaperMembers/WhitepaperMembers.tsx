import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { startCase, lowerCase } from "lodash";
import { generateCirclesBinaryNumber } from "../../utils";
import { selectGovernance } from "@/containers/Common/store/selectors";
import { ProposalsTypes } from "@/shared/constants";
import "./index.scss";

export default function WhitepaperMembers() {
  const governance = useSelector(selectGovernance());
  const [selectedMember, setSelectedMember] = useState({ ...governance?.circles[0], index: 0 });

  const members = governance?.circles.map((circle, index) => {
    return (
      <li
        key={index}
        onClick={() => setSelectedMember({ ...circle, index })}
        className={classNames({ active: selectedMember?.name === circle.name })}
      >
        {circle.name}
      </li>
    )
  })

  const renderContent = () => {
    const circle = governance?.circles.filter(circle => circle.name === selectedMember?.name)[0];

    const allowedProposals = Object.keys(circle?.allowedProposals || {}).map((proposal, index) => {
      return (
        <span key={index} className="whitepaper-members__feature-title">
          <img src="/icons/check.png" className="whitepaper-members__checkmark-icon" alt="checkmark" />
          {startCase(lowerCase(proposal))}
        </span>)
    });

    const allowedActions = Object.keys(circle?.allowedActions || {}).map((action, index) => {
      return (
        <span key={index} className="whitepaper-members__feature-title">
          <img src="/icons/check.png" className="whitepaper-members__checkmark-icon" alt="checkmark" />
          {startCase(lowerCase(action))}
        </span>)
    })

    const allowedVotes = useMemo(() => Object.keys(governance?.proposals || {}).filter((proposal, index) => {
      const circleBin = generateCirclesBinaryNumber([selectedMember.index])

      if (proposal === ProposalsTypes.ASSIGN_CIRCLE ||
        proposal === ProposalsTypes.REMOVE_CIRCLE) {
        return Object.keys(governance?.proposals[proposal] || {}).find((key) => {
          const obj = governance?.proposals[proposal] || {}

          return obj[key]?.global?.weights?.find(({ circles }) => circles & circleBin)
        })
      }

      if (governance?.proposals[proposal]?.global?.weights?.find(({ circles }) => circles & circleBin)) {
        return true
      }
    }).map((proposalKey, index) => {
      return (<span key={index} className="whitepaper-members__feature-title">
        <img src="/icons/check.png" className="whitepaper-members__checkmark-icon" alt="checkmark" />
        {startCase(lowerCase(proposalKey))}
      </span>)
    }), [governance, selectedMember])

    return (
      <div className="whitepaper-members__content">
        <div className="whitepaper-members__sub-title">Allowed Proposals</div>
        {allowedProposals}
        {Boolean(allowedVotes.length) && <div className="whitepaper-members__sub-title">Proposal Voting</div>}
        {allowedVotes}
        <div className="whitepaper-members__sub-title">Allowed Actions</div>
        {allowedActions}
      </div>
    )
  }

  return (
    <div className="whitepaper-members-wrapper">
      <ul className="whitepaper-members__members-select">
        {members}
      </ul>
      {renderContent()}
    </div>
  )
}