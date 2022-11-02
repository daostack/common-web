import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FundingAllocationStatus } from "@/shared/models/governance/proposals";
import { Loader } from "../../../../shared/components";
import { Proposal } from "../../../../shared/models";
import { setLoginModalState } from "../../../Auth/store/actions";
import { authentificated, selectUser } from "../../../Auth/store/selectors";
import { fetchCommonDetail } from "../../../Common/store/api";
import { fetchProposal } from "../../api";
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
  UploadUnavailable,
}

export default function SubmitInvoicesContainer() {
  const dispatch = useDispatch();
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.Loading,
  );
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
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        if (!isAuthenticated) {
          return;
        }
        const proposal = await fetchProposal(proposalId);
        if (!proposal) {
          return;
        }
        if (!(proposal.data.args.proposerId === user?.uid)) {
          setSubmissionStatus(SubmissionStatus.NotAuthorized);
          return;
        }
        if (proposal.data.legal.payoutDocs?.length > 0) {
          setSubmissionStatus(SubmissionStatus.Submitted);
          return;
        }
        if (
          proposal.data.tracker.status !==
          FundingAllocationStatus.PENDING_INVOICE_UPLOAD
        ) {
          setSubmissionStatus(SubmissionStatus.UploadUnavailable);
          return;
        }
        setProposal(proposal);
        const commonProposal = await fetchCommonDetail(
          proposal.data.args.commonId,
        );
        setCommonName(commonProposal?.name || "");
        setSubmissionStatus(SubmissionStatus.PendingUser);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [isAuthenticated, proposalId, user]);

  const renderContent = (submissionStatus: SubmissionStatus) => {
    switch (submissionStatus) {
      case SubmissionStatus.Loading:
        return <Loader className="loader" />;
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
            updateSubmissionStatus={() =>
              setSubmissionStatus(SubmissionStatus.Submitted)
            }
          />
        );
      case SubmissionStatus.Submitted:
        return "Already Submitted";
      default:
        return "Invoices upload is not available yet";
    }
  };

  return (
    <div className="submit-invoices-wrapper">
      {renderContent(submissionStatus)}
    </div>
  );
}
