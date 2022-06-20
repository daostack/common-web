import React, { useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectGovernance } from "@/containers/Common/store/selectors";
import "./index.scss";

export default function WhitepaperMembers() {
  const governance = useSelector(selectGovernance());
  const [selectedMember, setSelectedMember] = useState(governance?.circles[0].name);

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
    const proposals = Object.keys(circle?.allowedProposals!).map((proposal, index) => {
      return <span key={index}>{proposal}</span>
    });
    const actions = Object.keys(circle?.allowedActions!).map((action, index) => {
      return <span key={index}>{action}</span>
    })
    return (
      <div className="whitepaper-members__content">
        <div className="whitepaper-members__sub-title">Allowed Proposals</div>
        {proposals}
        <div className="whitepaper-members__sub-title">Allowed Actions</div>
        {actions}
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
