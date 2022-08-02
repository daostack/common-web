import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateProposal } from "@/containers/Common/interfaces";
import { createFundingProposal } from "@/containers/Common/store/actions";
import { Loader, Modal } from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { Common, Governance, CommonLink, Proposal } from "@/shared/models";
import { FundsAllocation, ProposalImage } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { FundDetails } from "./FundDetails";
import { Success } from "./Success";
import { FundsAllocationStep } from "./constants";
import { FundsAllocationData, FundType } from "./types";
import "./index.scss";

interface FundsAllocationStageProps {
  common: Common;
  governance: Governance;
  onFinish: (proposal?: Proposal) => void;
  onGoBack: () => void;
}

const initialFundsData = {
  title: "title",
  description: "description",
  goalOfPayment: "goalOfPayment",
  amount: 10,
  fund: "ILS" as FundType,
  links: [] as CommonLink[],
  images: [] as ProposalImage[],
};

const FundsAllocationStage: FC<FundsAllocationStageProps> = (props) => {
  const { common, governance, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const [fundsAllocationData, setFundsAllocationData] =
    useState<FundsAllocationData>(initialFundsData);
  const [step, setStep] = useState(FundsAllocationStep.Configuration);
  const [isProposalCreating, setIsProposalCreating] = useState(false);
  const [createdProposal, setCreatedProposal] =
    useState<FundsAllocation | null>(null);
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
  } = useCreateProposalContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isConfigurationStep = step === FundsAllocationStep.Configuration;
  const isSuccessStep = step === FundsAllocationStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;
  const isLoading = isProposalCreating;

  const handleConfigurationFinish = (data: FundsAllocationData) => {
    setFundsAllocationData(data);
    setStep(FundsAllocationStep.Funds);
  };

  const handleFundDetailsFinish = (data: FundsAllocationData) => {
    setFundsAllocationData(data);
    setStep(FundsAllocationStep.Confirmation);
  };

  const handleConfirm = () => {
    if (!fundsAllocationData) {
      return;
    }

    setIsProposalCreating(true);
    const description = `${fundsAllocationData.description}\n\nGoal of Payment:\n${fundsAllocationData.goalOfPayment}`;
    const payload: Omit<
      CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["data"],
      "type"
    > = {
      args: {
        description,
        amount: fundsAllocationData.amount * 100,
        commonId: common.id,
        title: fundsAllocationData.title,
        images: fundsAllocationData.images as ProposalImage[], //[] as ProposalImage[],
        links: fundsAllocationData.links,
        files: [],
      },
    };

    dispatch(
      createFundingProposal.request({
        payload,
        callback: (error, data) => {
          if (!error && data) {
            setCreatedProposal(data);
            setStep(FundsAllocationStep.Success);
            setIsProposalCreating(false);
          }
        },
      })
    );
  };

  const handleConfirmationCancel = () => {
    setStep(FundsAllocationStep.Configuration);
  };

  const handleBackToCommon = () => {
    onFinish();
  };

  const handleViewProposal = () => {
    if (createdProposal) {
      onFinish(createdProposal);
    }
  };

  useEffect(() => {
    setTitle(shouldShowModalTitle ? "Create New Proposal" : "");
  }, [setTitle, shouldShowModalTitle]);

  useEffect(() => {
    setOnGoBack(
      shouldShowModalTitle && !isProposalCreating ? onGoBack : undefined
    );
  }, [setOnGoBack, onGoBack, shouldShowModalTitle, isProposalCreating]);

  useEffect(() => {
    setShouldShowClosePrompt(!isSuccessStep);
  }, [setShouldShowClosePrompt, isSuccessStep]);

  useEffect(() => {
    setShouldBeOnFullHeight(isConfigurationStep || isLoading);
  }, [setShouldBeOnFullHeight, isConfigurationStep, isLoading]);

  const renderConfirmationStep = () =>
    fundsAllocationData && (
      <Confirmation
        fund={fundsAllocationData.fund}
        amount={fundsAllocationData.amount}
        onSubmit={handleConfirm}
        onCancel={handleConfirmationCancel}
      />
    );

  const renderSuccessStep = () => (
    <Success
      onBackToCommon={handleBackToCommon}
      onViewProposal={handleViewProposal}
    />
  );

  return (
    <div className="funds-allocation-creation-stage">
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          {(isConfigurationStep || isMobileView) && (
            <Configuration
              governance={governance}
              initialData={fundsAllocationData}
              onFinish={handleConfigurationFinish}
            />
          )}

          {(step === FundsAllocationStep.Funds || isMobileView) && (
            <FundDetails
              governance={governance}
              initialData={fundsAllocationData}
              onFinish={handleFundDetailsFinish}
              commonBalance={common.balance}
            />
          )}
          {step === FundsAllocationStep.Confirmation &&
            (isMobileView ? (
              <Modal
                isShowing
                onClose={handleConfirmationCancel}
                type={ModalType.MobilePopUp}
                hideCloseButton
              >
                {renderConfirmationStep()}
              </Modal>
            ) : (
              renderConfirmationStep()
            ))}
          {isSuccessStep &&
            (isMobileView ? (
              <Modal
                isShowing
                onClose={handleBackToCommon}
                type={ModalType.MobilePopUp}
                hideCloseButton
              >
                {renderSuccessStep()}
              </Modal>
            ) : (
              renderSuccessStep()
            ))}
        </>
      )}
    </div>
  );
};

export default FundsAllocationStage;
