import React, { useMemo, FC, useEffect, useCallback } from "react";
import classNames from "classnames";
import { Loader } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useBankAccountDetails } from "@/shared/hooks/useCases";
import ApprovedIcon from "@/shared/icons/approved.icon";
import { PaymeTypeCodes } from "@/shared/interfaces/api/payMe";
import { Common, DateFormat, User } from "@/shared/models";
import { FundsAllocation } from "@/shared/models/governance/proposals";
import { formatEpochTime, formatPrice, getUserName } from "@/shared/utils";
import {
  checkDeclinedProposal,
  checkPendingApprovalProposal,
} from "../../helpers";
import { DownloadFile } from "../DownloadFile";
import "./index.scss";

interface ProposalCardProps {
  proposal: FundsAllocation;
  common?: Common;
  user?: User;
  withAdditionalData?: boolean;
  onClick?: () => void;
}

const ProposalCard: FC<ProposalCardProps> = (props) => {
  const { proposal, common, user, withAdditionalData = false, onClick } = props;
  const isPendingApproval = checkPendingApprovalProposal(proposal);
  const isDeclined = checkDeclinedProposal(proposal);
  const isApproved = !isPendingApproval && !isDeclined;
  const { payoutDocs } = proposal.data.legal;
  const invoicesTotal = useMemo(
    () => (payoutDocs || []).reduce((acc, doc) => acc + (doc.amount || 0), 0),
    [payoutDocs],
  );

  const {
    loading: isBankAccountLoading,
    data: bankAccountDetails,
    fetchBankAccountDetailsByUserId,
  } = useBankAccountDetails();

  const identificationDocs = useMemo(() => {
    if (!bankAccountDetails) {
      return null;
    }

    const userIdPhoto =
      bankAccountDetails?.identificationDocs.find(
        (doc) => doc.legalType === PaymeTypeCodes.SocialId,
      ) || null;
    const bankDocument =
      bankAccountDetails?.identificationDocs.find(
        (doc) => doc.legalType === PaymeTypeCodes.BankAccountOwnership,
      ) || null;
    const incorporationDocument =
      bankAccountDetails?.identificationDocs.find(
        (doc) => doc.legalType === PaymeTypeCodes.CorporateCertificate,
      ) || null;

    return {
      userIdPhoto,
      bankDocument,
      incorporationDocument,
    };
  }, [bankAccountDetails]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    fetchBankAccountDetailsByUserId(user.uid);
  }, [user]);

  const containerClassName = classNames("trustee-proposal-card", {
    "trustee-proposal-card--without-action": !onClick,
  });
  const approvalDateClassName = classNames(
    "trustee-proposal-card__approval-date",
    {
      "trustee-proposal-card__approval-date--approved": isApproved,
      "trustee-proposal-card__approval-date--declined": isDeclined,
    },
  );
  const priceWrapperClassName = classNames(
    "trustee-proposal-card__price-wrapper",
    {
      "trustee-proposal-card__price-wrapper--approved": isApproved,
      "trustee-proposal-card__price-wrapper--declined": isDeclined,
    },
  );

  const UserDocuments = useCallback(() => {
    if (isBankAccountLoading) {
      return (
        <div className="trustee-proposal-card__file-link-wrapper">
          <Loader className="trustee-proposal-card__file-link-wrapper__loader" />
        </div>
      );
    }

    return (
      <div className="trustee-proposal-card__file-link-wrapper">
        <div className="trustee-proposal-card__file-link-wrapper__top-container">
          {identificationDocs?.userIdPhoto?.downloadURL && (
            <DownloadFile
              downloadURL={identificationDocs?.userIdPhoto?.downloadURL}
              fileName="User ID"
            />
          )}
          {identificationDocs?.bankDocument?.downloadURL && (
            <DownloadFile
              downloadURL={identificationDocs?.bankDocument?.downloadURL}
              fileName="Bank document"
            />
          )}
        </div>
        {identificationDocs?.incorporationDocument?.downloadURL && (
          <DownloadFile
            downloadURL={identificationDocs?.incorporationDocument?.downloadURL}
            fileName="Incorporation Document"
          />
        )}
      </div>
    );
  }, [identificationDocs, isBankAccountLoading]);

  return (
    <div className={containerClassName}>
      <span className={approvalDateClassName}>
        <ApprovedIcon className="trustee-proposal-card__approval-icon" />
        <span>
          Approved on{" "}
          {proposal.approvalDate
            ? formatEpochTime(proposal.approvalDate, DateFormat.Human)
            : "UNKNOWN"}
        </span>
      </span>
      <div className="trustee-proposal-card__content-wrapper">
        <div className="trustee-proposal-card__content">
          {withAdditionalData && (
            <div className="trustee-proposal-card__extended-data-wrapper">
              <p className="trustee-proposal-card__extended-data">
                <span
                  className="trustee-proposal-card__extended-data-label"
                  style={{ fontSize: "0.8125rem" }}
                >
                  Common name
                </span>
                {common?.name || "-"}
              </p>
              <p className="trustee-proposal-card__extended-data">
                <span className="trustee-proposal-card__extended-data-label">
                  Beneficiary name
                </span>
                {user ? getUserName(user) : "-"}
              </p>
              <p className="trustee-proposal-card__extended-data">
                <span className="trustee-proposal-card__extended-data-label">
                  ID Number
                </span>
                {bankAccountDetails?.socialId || "-"}
              </p>
              <p className="trustee-proposal-card__extended-data">
                <span className="trustee-proposal-card__extended-data-label">
                  Bank Account
                </span>
                {bankAccountDetails?.accountNumber || "-"}
              </p>
              <p className="trustee-proposal-card__extended-data">
                <span
                  className="trustee-proposal-card__extended-data-label"
                  style={{ fontSize: "0.8125rem" }}
                >
                  Payment for
                </span>
                {proposal.data.args.title}
              </p>
            </div>
          )}
          <div className="trustee-proposal-card__prices-wrapper">
            <div className={priceWrapperClassName}>
              <span>Proposal Requested</span>
              <span className="trustee-proposal-card__price">
                {formatPrice(proposal.data.args.amount)}
              </span>
            </div>
            <div className={priceWrapperClassName}>
              <span>Invoices Total</span>
              <span className="trustee-proposal-card__price">
                {formatPrice(invoicesTotal)}
              </span>
            </div>
          </div>
          <UserDocuments />
        </div>
        {onClick && (
          <button
            className="button-blue trustee-proposal-card__view-button"
            onClick={onClick}
          >
            View Invoices
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
