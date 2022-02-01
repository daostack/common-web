import React, { useCallback, useMemo, useState } from "react";

import { Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";
import { Common, Proposal } from "@/shared/models";
import { AddProposalForm } from "./AddProposalForm";
import { AddProposalConfirm } from "./AddProposalConfirm";
import { AddProposalLoader } from "./AddProposalLoader";
import { AdProposalSuccess } from "./AddProposalSuccess";
import { AdProposalFailure } from "./AddProposalFailure";
import { CreateFundingRequestProposalPayload } from "@/shared/interfaces/api/proposal";
import { AddPaymentMethod } from "./AddPaymentMethod";

export enum AddProposalSteps {
  CREATE = "create",
  CONFIRM = "confirm",
  LOADER = "loader",
  SUCCESS = "success",
  FAILURE = "failure",
  PAYMENT_METHOD = "payment_method",
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
  hasPaymentMethod,
  proposals,
  getProposalDetail,
}: AddDiscussionComponentProps) => {
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

  const onPaymentLoad = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.CREATE);
  }, []);

  const addPaymentMethod = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.PAYMENT_METHOD);
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
            hasPaymentMethod={hasPaymentMethod}
            addPaymentMethod={addPaymentMethod}
          />
        );
      case AddProposalSteps.PAYMENT_METHOD:
        return <AddPaymentMethod onPaymentMethod={onPaymentLoad} />;
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
            hasPaymentMethod={hasPaymentMethod}
            addPaymentMethod={addPaymentMethod}
          />
        );
    }
  }, [
    proposalCreationStep,
    saveProposalState,
    confirmProposal,
    onPaymentLoad,
    addPaymentMethod,
    handleProposalCreatedSuccess,
    hasPaymentMethod,
    common,
    onClose,
  ]);

  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      {renderProposalStep}
    </Modal>
  );
};
