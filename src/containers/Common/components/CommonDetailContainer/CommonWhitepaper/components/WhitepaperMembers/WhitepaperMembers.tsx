import React, { useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectGovernance } from "@/containers/Common/store/selectors";
import { formatCamelSnakeCase } from "../../utils";
import "./index.scss";

export default function WhitepaperMembers() {
  const governance = useSelector(selectGovernance());
  const [selectedMember, setSelectedMember] = useState(governance?.circles[0]?.name);

  const members = governance?.circles.map((circle, index) => {
    return (
      <li
        key={index}
        onClick={() => setSelectedMember(circle.name)}
        className={classNames({ active: selectedMember === circle.name })}
      >
        {circle.name}
      </li>
    )
  })

  const renderContent = () => {
    const circle = governance?.circles.filter(circle => circle.name === selectedMember)[0];
    const allowedProposals = Object.keys(circle?.allowedProposals || {}).map((proposal, index) => {
      return (
        <span key={index} className="whitepaper-members__feature-title">
          <img src="/icons/check.png" className="whitepaper-members__checkmark-icon" alt="checkmark" />
          {formatCamelSnakeCase(proposal)}
        </span>)
    });
    const allowedActions = Object.keys(circle?.allowedActions!).map((action, index) => {
      return (
        <span key={index} className="whitepaper-members__feature-title">
          <img src="/icons/check.png" className="whitepaper-members__checkmark-icon" alt="checkmark" />
          {formatCamelSnakeCase(action)}
        </span>)
    })
    return (
      <div className="whitepaper-members__content">
        <div className="whitepaper-members__sub-title">Allowed Proposals</div>
        {allowedProposals}
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
