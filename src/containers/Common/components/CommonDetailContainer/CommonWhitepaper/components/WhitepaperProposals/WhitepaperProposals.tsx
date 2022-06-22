import React from "react";
import { useSelector } from "react-redux";
import { selectGovernance } from "@/containers/Common/store/selectors";
import WhitepaperProposalCard from "./components/WhitepaperProposalCard/WhitepaperProposalCard";
import "./index.scss";

// TODO: temporary until we have a design for the other proposal types
const PROPOSALS_TO_RENDER = ["FUNDS_ALLOCATION", "MEMBER_ADMITTANCE"];

export default function WhitepaperProposals() {
  const governance = useSelector(selectGovernance());

  const proposals: JSX.Element[] | undefined = [];
  for (const proposal in governance?.proposals) {
    if (PROPOSALS_TO_RENDER.includes(proposal)) {
      proposals.push(
        <WhitepaperProposalCard
          key={proposal}
          proposalType={proposal}
          proposalData={governance?.proposals[proposal]} />
      );
    }
  }

  return (
    <div className="whitepaper-proposals-wrapper">
      {proposals}
    </div>
  )
}
