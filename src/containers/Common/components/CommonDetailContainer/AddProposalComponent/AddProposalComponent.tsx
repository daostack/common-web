import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Modal } from "@/shared/components";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps, ModalRef } from "@/shared/interfaces";
import { Common, Proposal } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import { AddProposalForm } from "./AddProposalForm";
import { AddProposalConfirm } from "./AddProposalConfirm";
import { AddProposalLoader } from "./AddProposalLoader";
import { AdProposalSuccess } from "./AddProposalSuccess";
import { AdProposalFailure } from "./AddProposalFailure";
import { AddBankDetails } from "./AddBankDetails/AddBankDetails";
import {
  CreateFundsAllocationData,
  CreateFundsAllocationFormData,
} from "./types";
import "./index.scss";

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
    payload: CreateFundsAllocationData,
    callback: (error: string | null) => void
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
  const modalRef = useRef<ModalRef>(null);
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });

  const [
    fundingRequest,
    setFundingRequest,
  ] = useState<CreateFundsAllocationData>({
    args: {
      title: "",
      description: "",
      links: [],
      images: [],
      amount: 0,
      commonId: common.id,
      files: [],
    },
  });
  const [errorMessage, setErrorMessage] = useState("");
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

  const confirmProposal = useCallback(
    (fundingRequest: CreateFundsAllocationData) => {
      changeCreationProposalStep(AddProposalSteps.LOADER);
      fundingRequest.args.links = fundingRequest.args.links?.filter(
        (link) => link.title && link.value
      );
      fundingRequest.args.amount = fundingRequest.args.amount * 100;
      onProposalAdd(fundingRequest, (error) => {
        if (error !== null) {
          setErrorMessage(error);
          changeCreationProposalStep(AddProposalSteps.FAILURE);
        } else {
          changeCreationProposalStep(AddProposalSteps.SUCCESS);
        }
      });
    },
    [onProposalAdd]
  );

  const saveProposalState = useCallback(
    (payload: Partial<CreateFundsAllocationFormData>) => {
      const fundingRequestData = {
        args: { ...fundingRequest.args, ...payload },
      };
      setFundingRequest(fundingRequestData);
      if (!payload?.amount) {
        confirmProposal(fundingRequestData);
      } else {
        changeCreationProposalStep(AddProposalSteps.CONFIRM);
      }
    },
    [fundingRequest, confirmProposal]
  );

  const onBankDetails = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.CREATE);
  }, []);

  const addBankDetails = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.BANK_DETAILS);
  }, []);

  const moveStageBack = useCallback(() => {
    changeCreationProposalStep(AddProposalSteps.CREATE);
  }, []);

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
        return (
          <AddProposalConfirm
            onConfirm={() => confirmProposal(fundingRequest)}
          />
        );
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
        return (
          <AdProposalFailure closePopup={onClose} errorMessage={errorMessage} />
        );
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
    fundingRequest,
    errorMessage,
  ]);

  useEffect(() => {
    if (isShowing) {
      disableZoom();
    } else {
      resetZoom();
    }
  }, [isShowing, disableZoom, resetZoom]);

  useEffect(() => {
    modalRef.current?.scrollToTop();
  }, [proposalCreationStep]);

  return (
    <Modal
      ref={modalRef}
      isShowing={isShowing}
      onClose={onClose}
      className={classNames("create-proposal-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      onGoBack={
        proposalCreationStep === AddProposalSteps.BANK_DETAILS ||
        proposalCreationStep === AddProposalSteps.CONFIRM
          ? moveStageBack
          : undefined
      }
      closePrompt
    >
      {renderProposalStep}
    </Modal>
  );
};
