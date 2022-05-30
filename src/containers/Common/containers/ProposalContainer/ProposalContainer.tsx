import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CommonDetailContainer, Tabs } from "..";
import { fetchProposalById } from "../../store/api";
import { Proposal, ProposalState } from "@/shared/models";
import { DynamicLinkType } from "@/shared/constants";

interface ProposalRouterParams {
  id: string;
}

const ProposalContainer = () => {
  const { id: proposalId } = useParams<ProposalRouterParams>();
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null);
  const [currentTab, setCurrentTab] = useState<Tabs | null>(null);

  useEffect(() => {
    if (currentProposal || !proposalId)
      return;

    (
      async () => {
        try {
          const requestingProposal = await fetchProposalById(proposalId);

          setCurrentProposal(requestingProposal);
        } catch (error) {
          console.log(error);
        }
      }
    )();
  }, [currentProposal, setCurrentProposal, proposalId]);

  useEffect(() => {
    if (!currentProposal)
      return;

    if (currentProposal.state === ProposalState.COUNTDOWN) {
      setCurrentTab(Tabs.Proposals);
    } else {
      setCurrentTab(Tabs.History);
    }
  },
    [currentProposal, setCurrentTab]
  );

  return (
    (currentProposal && currentTab)
    && <CommonDetailContainer
      commonId={currentProposal.data.args.commonId}
      activeModalElement={currentProposal}
      linkType={DynamicLinkType.Proposal}
      tab={currentTab}
    />
  );
};

export default ProposalContainer;
