import React from "react";
import { useSelector } from "react-redux";
import { selectGovernance } from "@/containers/Common/store/selectors";
import WhitepaperProposalCard from "./components/WhitepaperProposalCard/WhitepaperProposalCard";
import "./index.scss";


const PROPOSALS_TO_RENDER = ["FUNDS_ALLOCATION", "MEMBER_ADMITTANCE"];

export default function WhitepaperProposals() {
  const governance = useSelector(selectGovernance());

  const proposals = [] as any;
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
