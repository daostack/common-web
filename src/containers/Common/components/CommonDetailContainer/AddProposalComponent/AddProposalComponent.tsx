import React, { useCallback, useMemo, useState } from "react";

import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";
import { Common } from "@/shared/models";
import { AddProposalForm } from "./AddProposalForm";
import { AddProposalConfirm } from "./AddProposalConfirm";
import { AddProposalLoader } from "./AddProposalLoader";
import { AdProposalSuccess } from "./AddProposalSuccess";
import { AdProposalFailure } from "./AddProposalFailure";
import { CreateFundingRequestProposalPayload } from "@/shared/interfaces/api/proposal";

export enum AddProposalSteps {
  CREATE = "create",
  CONFIRM = "confirm",
  LOADER = "loader",
  SUCCESS = "success",
  FAILURE = "failure",
}

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onProposalAdd: (
    payload: CreateFundingRequestProposalPayload,
    callback: (step: AddProposalSteps) => void
  ) => void;
  common: Common;
  hasPaymentMethod: boolean;
}

export const AddProposalComponent = ({
  isShowing,
  onClose,
  onProposalAdd,
  common,
  hasPaymentMethod,
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

  const saveProposalState = useCallback(
    (payload: Partial<CreateFundingRequestProposalPayload>) => {
      setFundingRequest({ ...fundingRequest, ...payload });
      changeCreationProposalStep(AddProposalSteps.CONFIRM);
    },
    [fundingRequest]
  );

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
          />
        );
      case AddProposalSteps.CONFIRM:
        return <AddProposalConfirm onConfirm={confirmProposal} />;
      case AddProposalSteps.LOADER:
        return <AddProposalLoader />;
      case AddProposalSteps.SUCCESS:
        return <AdProposalSuccess />;
      case AddProposalSteps.FAILURE:
        return <AdProposalFailure />;
      default:
        return (
          <AddProposalForm
            saveProposalState={saveProposalState}
            common={common}
            hasPaymentMethod={hasPaymentMethod}
          />
        );
    }
  }, [
    proposalCreationStep,
    saveProposalState,
    confirmProposal,
    hasPaymentMethod,
    common,
  ]);

  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      {renderProposalStep}
    </Modal>
  );
};
