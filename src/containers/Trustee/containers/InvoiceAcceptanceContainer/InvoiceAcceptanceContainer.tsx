import React, { useEffect, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Loader, Separator } from "../../../../shared/components";
import { StickyInfo } from "../../components/StickyInfo";
import { getProposalForApproval } from "../../store/actions";
import {
  selectProposalForApproval,
  selectIsProposalForApprovalLoaded,
} from "../../store/selectors";
import "./index.scss";

const InvoiceAcceptanceContainer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { proposalId } = useParams<{ proposalId: string }>();
  const proposalForApproval = useSelector(selectProposalForApproval());
  const isProposalForApprovalLoaded = useSelector(
    selectIsProposalForApprovalLoaded()
  );

  useEffect(() => {
    if (!isProposalForApprovalLoaded) {
      dispatch(getProposalForApproval.request(proposalId));
    }
  }, [dispatch, isProposalForApprovalLoaded, proposalId]);

  return (
    <>
      <StickyInfo className="invoice-acceptance-container__sticky-info">
        <Separator className="invoice-acceptance-container__separator" />
      </StickyInfo>
      <div className="invoice-acceptance-container">
        {!isProposalForApprovalLoaded && <Loader />}
        {!proposalForApproval && isProposalForApprovalLoaded && (
          <span className="invoice-acceptance-container__not-loaded-proposal">
            Something wrong with the invoice
          </span>
        )}
        {proposalForApproval && isProposalForApprovalLoaded && (
          <>InvoiceAcceptanceContainer</>
        )}
      </div>
    </>
  );
};

export default InvoiceAcceptanceContainer;
