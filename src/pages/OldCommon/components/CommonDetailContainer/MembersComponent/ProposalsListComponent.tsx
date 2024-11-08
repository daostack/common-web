import React, { FC, useCallback, memo } from "react";
import { useHistory } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/constants";
import { Proposal } from "@/shared/models";
import { MemberAdmittance } from "../../../../../shared/models/governance/proposals";
import ProposalItemComponent from "../ProposalsComponent/ProposalItemComponent";

interface ProposalsListComponentProps {
  proposals: MemberAdmittance[];
  emptyText: string;
}

const ProposalsList: FC<ProposalsListComponentProps> = ({
  proposals,
  emptyText,
}) => {
  const history = useHistory();
  const getProposalDetail = useCallback(
    (payload: Proposal) =>
      history.push(ROUTE_PATHS.PROPOSAL_DETAIL.replace(":id", payload.id)),
    [],
  );

  return (
    <div className="proposals-component-wrapper">
      {Boolean(proposals.length) &&
        proposals.map((proposal) => (
          <ProposalItemComponent
            key={proposal.id}
            proposal={proposal}
            loadProposalDetail={getProposalDetail}
          />
        ))}
      {!proposals.length && (
        <p className="proposals-component-wrapper-empty-text">{emptyText}</p>
      )}
    </div>
  );
};

export default memo(ProposalsList);
