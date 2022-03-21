import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Modal } from "@/shared/components";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";
import { Common, Proposal } from "@/shared/models";
import { AddProposalForm } from "./AddProposalForm";
import { AddProposalConfirm } from "./AddProposalConfirm";
import { AddProposalLoader } from "./AddProposalLoader";
import { AdProposalSuccess } from "./AddProposalSuccess";
import { AdProposalFailure } from "./AddProposalFailure";
import { CreateFundingRequestProposalPayload } from "@/shared/interfaces/api/proposal";
import { AddBankDetails } from "./AddBankDetails/AddBankDetails";
import { useSelector } from "react-redux";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import classNames from "classnames";

export enum AddProposalSteps {
  CREATE,
  CONFIRM,
  LOADER,
  SUCCESS,
  FAILURE,
  BANK_DETAILS,
}

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onProposalAdd: (
    payload: CreateFundingRequestProposalPayload,
    callback: (step: AddProposalSteps) => void
  ) => void;
  common: Common;
  hasPaymentMethod: boolean;
  proposals: Proposal[];
  getProposalDetail: (payload: Proposal) => void;
}

export const AddProposalComponent = ({
  isShowing,
  onClose,
  onProposalAdd,
  common,
  proposals,
  getProposalDetail,
}: AddDiscussionComponentProps) => {
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const [
    fundingRequest,
    setFundingRequest,
  ] = useState<CreateFundingRequestProposalPayload>({
    title: "",
    description: "",
    links: [],
    images: [],
    amount: 0,
    commonId: common.id,
  });
  const [proposalCreationStep, changeCreationProposalStep] = useState(
    AddProposalSteps.CREATE
  );

  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const createdProposal = useMemo(
    () => (proposals.length ? proposals[0] : null),
    [proposals]
  );

  const handleProposalCreatedSuccess = useCallback(() => {
    onClose();
    if (createdProposal) {
      setTimeout(() => {
        getProposalDetail(createdProposal);
      }, 0);
    }
  }, [createdProposal, getProposalDetail, onClose]);

  const saveProposalState = useCallback(
    (payload: Partial<CreateFundingRequestProposalPayload>) => {
      setFundingRequest({ ...fundingRequest, ...payload });
      changeCreationProposalStep(AddProposalSteps.CONFIRM);
    },
    [fundingRequest]
  );

  const onBankDetails = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.CREATE);
  }, []);

  const addBankDetails = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.BANK_DETAILS);
  }, []);

  const confirmProposal = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.LOADER);
    fundingRequest.links = fundingRequest.links?.map((i: any) => {
      return {
        title: i.title,
        value: i.link,
      };
    });
    fundingRequest.amount = fundingRequest.amount * 100;
    onProposalAdd(fundingRequest, changeCreationProposalStep);
  }, [onProposalAdd, fundingRequest]);

  const renderProposalStep = useMemo(() => {
    switch (proposalCreationStep) {
      case AddProposalSteps.CREATE:
        return (
          <AddProposalForm
            common={common}
            saveProposalState={saveProposalState}
            addBankDetails={addBankDetails}
          />
        );
      case AddProposalSteps.BANK_DETAILS:
        return <AddBankDetails onBankDetails={onBankDetails} />;
      case AddProposalSteps.CONFIRM:
        return <AddProposalConfirm onConfirm={confirmProposal} />;
      case AddProposalSteps.LOADER:
        return <AddProposalLoader />;
      case AddProposalSteps.SUCCESS:
        return (
          <AdProposalSuccess
            closePopup={onClose}
            openProposal={handleProposalCreatedSuccess}
          />
        );
      case AddProposalSteps.FAILURE:
        return <AdProposalFailure closePopup={onClose} />;
      default:
        return (
          <AddProposalForm
            saveProposalState={saveProposalState}
            common={common}
            addBankDetails={addBankDetails}
          />
        );
    }
  }, [
    proposalCreationStep,
    saveProposalState,
    confirmProposal,
    onBankDetails,
    addBankDetails,
    handleProposalCreatedSuccess,
    common,
    onClose,
  ]);

  useEffect(() => {
    if (isShowing) {
      disableZoom();
    } else {
      resetZoom();
    }
  }, [isShowing, disableZoom, resetZoom]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      className={classNames("create-proposal-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
    >
      {renderProposalStep}
    </Modal>
  );
};
