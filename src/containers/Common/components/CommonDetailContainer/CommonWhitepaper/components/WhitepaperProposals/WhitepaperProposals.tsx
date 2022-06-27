import React from "react";
import { useSelector } from "react-redux";
import { selectGovernance } from "@/containers/Common/store/selectors";
import WhitepaperProposalCard from "./components/WhitepaperProposalCard/WhitepaperProposalCard";
import "./index.scss";

// TODO: temporary until we have a better way to handle this
const PROPOSALS_TYPE_1 = ["FUNDS_ALLOCATION", "MEMBER_ADMITTANCE"];
const PROPOSALS_TYPE_2 = ["ASSIGN_CIRCLE", "REMOVE_CIRCLE"];

export default function WhitepaperProposals() {
  const governance = useSelector(selectGovernance());

  const proposals: JSX.Element[] | undefined = [];
  for (const proposal in governance?.proposals) {
    if (PROPOSALS_TYPE_1.includes(proposal)) {
      proposals.push(
        <WhitepaperProposalCard
          key={proposal}
          proposalType={proposal}
          proposalData={governance?.proposals[proposal]}
          circles={governance?.circles.map(c => c.name)!} />
      );
    }
    if (PROPOSALS_TYPE_2.includes(proposal)) {
      proposals.push(
        <WhitepaperProposalCard
          key={proposal}
          proposalType={proposal}
          proposalData={governance?.proposals[proposal][1]} // TODO: for now we take the first index for "CIRCLE" proposal. Need to check this.
          circles={governance?.circles.map(c => c.name)!} />
      );
    }
  }

  return (
    <div className="whitepaper-proposals-wrapper">
      {proposals}
    </div>
  )
}
