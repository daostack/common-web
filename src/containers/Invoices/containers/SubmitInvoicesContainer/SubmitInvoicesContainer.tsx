import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authentificated, selectUser } from "../../../Auth/store/selectors";
import { useParams } from "react-router-dom";
import { fetchProposal } from "../../api";
import { Loader } from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { fetchCommonDetail } from "../../../Common/store/api";
import { setLoginModalState } from "../../../Auth/store/actions";
import { ProposalDetails } from "../../components/ProposalDetails";
import "./index.scss";

interface AddInvoicesRouterParams {
  proposalId: string;
}

enum SubmissionStatus {
  Loading,
  PendingUser,
  NotAuthorized,
  Submitted,
  NotLoggedIn,
}

export default function SubmitInvoicesContainer() {
  const dispatch = useDispatch();
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(SubmissionStatus.Loading);
  const { proposalId } = useParams<AddInvoicesRouterParams>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [commonName, setCommonName] = useState("");
  const user = useSelector(selectUser());
  const isAuthenticated = useSelector(authentificated());

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(setLoginModalState({ isShowing: true }));
      setSubmissionStatus(SubmissionStatus.NotLoggedIn);
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    (async () => {
      try {
        if (!isAuthenticated) {
          return;
        }
        const proposal = await fetchProposal(proposalId);
        if (!(proposal.proposerId === user?.uid)) {
          setSubmissionStatus(SubmissionStatus.NotAuthorized);
          return;
        }
        if (proposal.payoutDocs && proposal.payoutDocs?.length > 0) {
          setSubmissionStatus(SubmissionStatus.Submitted);
          return;
        }
        setProposal(proposal);
        const commonProposal = await fetchCommonDetail(proposal.commonId);
        setCommonName(commonProposal?.name || "");
        setSubmissionStatus(SubmissionStatus.PendingUser);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [isAuthenticated, proposalId, user])

  const renderContent = (submissionStatus: SubmissionStatus) => {
    switch (submissionStatus) {
      case SubmissionStatus.Loading:
        return <Loader className="loader" />
      case SubmissionStatus.NotLoggedIn:
        return "Please Log In";
      case SubmissionStatus.NotAuthorized:
        return "Only the proposer can submit invoices for this proposal.";
      case SubmissionStatus.PendingUser:
        return (
          <ProposalDetails
            commonName={commonName}
            user={user}
            proposal={proposal}
            updateSubmissionStatus={() => setSubmissionStatus(SubmissionStatus.Submitted)} />
        );
      case SubmissionStatus.Submitted:
        return "Already Submitted";
    }
  }

  return (
    <div className="submit-invoices-wrapper">
      {renderContent(submissionStatus)}
    </div>
  )
}
