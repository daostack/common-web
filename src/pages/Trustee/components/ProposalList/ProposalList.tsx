import React, { FC } from "react";
import { Loader } from "@/shared/components";
import { ExtendedProposal } from "../../interfaces";
import { ProposalCard } from "../ProposalCard";
import "./index.scss";

interface ProposalListProps {
  title: string;
  emptyListText: string;
  proposals: ExtendedProposal[];
  isLoading: boolean;
  onProposalView: (proposal: ExtendedProposal) => void;
}

const ProposalList: FC<ProposalListProps> = (props) => {
  const { title, emptyListText, proposals, isLoading, onProposalView } = props;

  return (
    <section className="invoice-list-wrapper">
      <h2 className="invoice-list-wrapper__title">{title}</h2>
      {isLoading && <Loader />}
      {proposals.length === 0 && !isLoading && (
        <span className="invoice-list-wrapper__empty-text">
          {emptyListText}
        </span>
      )}
      {proposals.length > 0 && !isLoading && (
        <ul className="invoice-list-wrapper__cards">
          {proposals.map((proposal) => (
            <li
              key={proposal.proposal.id}
              className="invoice-list-wrapper__card-wrapper"
            >
              <ProposalCard
                proposal={proposal.proposal}
                common={proposal.common}
                user={proposal.user}
                withAdditionalData
                onClick={() => onProposalView(proposal)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProposalList;
