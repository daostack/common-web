import React from "react";
import { useSelector } from "react-redux";
import { selectGovernance } from "@/pages/OldCommon/store/selectors";
import WhitepaperProposalCard from "./components/WhitepaperProposalCard/WhitepaperProposalCard";

interface Props {
  isSubCommon: boolean;
}

export default function WhitepaperProposals({ isSubCommon }: Props) {
  const governance = useSelector(selectGovernance());

  const proposals: JSX.Element[] | undefined = [];
  for (const proposal in governance?.proposals) {
    proposals.push(
      <WhitepaperProposalCard
        key={proposal}
        proposalType={proposal}
        proposalData={governance?.proposals[proposal]}
        circles={governance?.circles}
        isSubCommon={isSubCommon}
      />,
    );
  }

  return <div className="whitepaper-proposals-wrapper">{proposals}</div>;
}
