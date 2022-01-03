import React, { FC } from "react";
import { Proposal } from "../../../../shared/models";
import { ProposalCard } from "../ProposalCard";
import "./index.scss";

interface ProposalListProps {
  title: string;
  emptyListText: string;
  proposals: Proposal[];
  onProposalView: (proposal: Proposal) => void;
}

const ProposalList: FC<ProposalListProps> = (props) => {
  const { title, emptyListText, proposals, onProposalView } = props;

  return (
    <section className="invoice-list-wrapper">
      <h2 className="invoice-list-wrapper__title">{title}</h2>
      {proposals.length === 0 && (
        <span className="invoice-list-wrapper__empty-text">
          {emptyListText}
        </span>
      )}
      {proposals.length > 0 && (
        <ul className="invoice-list-wrapper__cards">
          {proposals.map((proposal) => (
            <li
              key={proposal.id}
              className="invoice-list-wrapper__card-wrapper"
            >
              <ProposalCard
                proposal={proposal}
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
