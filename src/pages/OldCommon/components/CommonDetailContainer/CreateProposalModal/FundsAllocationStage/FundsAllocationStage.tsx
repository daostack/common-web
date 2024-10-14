import React, { FC, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import {
  createFundingProposal,
  getCommonsList,
} from "@/pages/OldCommon/store/actions";
import { selectCommonList } from "@/pages/OldCommon/store/selectors";
import { Loader, Modal } from "@/shared/components";
import {
  AllocateFundsTo,
  ProposalsTypes,
  ScreenSize,
} from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import {
  Common,
  Governance,
  CommonLink,
  Proposal,
  Currency,
} from "@/shared/models";
import {
  FundsAllocation,
  ProposalImage,
} from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { FundDetails } from "./FundDetails";
import { FundAllocationForm } from "./FundsAllocationForm";
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
  fund: FundType.ILS,
  links: [] as CommonLink[],
  images: [] as ProposalImage[],
  to: AllocateFundsTo.Proposer,
  subcommonId: null,
  otherMemberId: null,
  recipientName: "",
};

const FundsAllocationStage: FC<FundsAllocationStageProps> = (props) => {
  const { common, governance, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const allCommons = useSelector(selectCommonList());
  const [fundsAllocationData, setFundsAllocationData] =
    useState<FundsAllocationData>(initialFundsData);
  const [step, setStep] = useState(FundsAllocationStep.Configuration);
  const [isProposalCreating, setIsProposalCreating] = useState(false);
  const [isCommonsLoadingStarted, setIsCommonsLoadingStarted] = useState(false);
  const [createdProposal, setCreatedProposal] =
    useState<FundsAllocation | null>(null);
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
    onError,
  } = useCreateProposalContext();
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers({ commonId: common.id });
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isConfigurationStep = step === FundsAllocationStep.Configuration;
  const isSuccessStep = step === FundsAllocationStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;
  const isLoading = isProposalCreating || !areCommonMembersFetched;
  const commons = useMemo(
    () =>
      allCommons.filter(
        (currCommon) => currCommon.directParent?.commonId === common.id,
      ),
    [allCommons],
  );

  const handleConfigurationFinish = (data: FundsAllocationData) => {
    setFundsAllocationData((fundsAllocationData) => ({
      ...fundsAllocationData,
      ...data,
    }));
    setStep(FundsAllocationStep.Funds);
  };

  const handleFundDetailsFinish = (data: FundsAllocationData) => {
    setFundsAllocationData((fundsAllocationData) => ({
      ...fundsAllocationData,
      ...data,
    }));
    setStep(FundsAllocationStep.Confirmation);
  };

  useEffect(() => {
    if (governance.commonId) {
      fetchCommonMembers();
    }
  }, [fetchCommonMembers, governance.commonId]);

  useEffect(() => {
    if (!isCommonsLoadingStarted && commons.length === 0) {
      setIsCommonsLoadingStarted(true);
      dispatch(getCommonsList.request());
    }
  }, [dispatch, isCommonsLoadingStarted, commons]);

  const handleConfirm = () => {
    if (!fundsAllocationData) {
      return;
    }

    const recipient = fundsAllocationData?.subcommonId
      ? { subcommonId: fundsAllocationData.subcommonId }
      : { otherMemberId: fundsAllocationData.otherMemberId };

    setIsProposalCreating(true);
    const proposalId = uuidv4();
    const discussionId = uuidv4();
    const description = `${fundsAllocationData.description}\n\nGoal of Payment:\n${fundsAllocationData.goalOfPayment}`;
    const payload: Omit<
      CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["data"],
      "type"
    > = {
      args: {
        id: proposalId,
        discussionId,
        description,
        amount: {
          amount: fundsAllocationData.amount * 100,
          currency: Currency.ILS,
        },
        commonId: common.id,
        title: fundsAllocationData.title,
        images: fundsAllocationData.images as ProposalImage[],
        links: fundsAllocationData.links,
        files: [],
        to: fundsAllocationData.to,
        ...recipient,
      },
    };

    dispatch(
      createFundingProposal.request({
        payload,
        callback: (error, data) => {
          if (error || !data) {
            onError(error || "Something went wrong");
            return;
          }

          setCreatedProposal(data);
          setStep(FundsAllocationStep.Success);
          setIsProposalCreating(false);
        },
      }),
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
      shouldShowModalTitle && !isProposalCreating ? onGoBack : undefined,
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
        to={fundsAllocationData.to}
        recipientName={fundsAllocationData?.recipientName}
        isLoading={isProposalCreating}
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
          {isMobileView ? (
            <FundAllocationForm
              governance={governance}
              initialData={fundsAllocationData}
              onFinish={handleFundDetailsFinish}
              commonBalance={common.balance.amount}
              commonMembers={commonMembers}
              commonList={commons}
            />
          ) : (
            <>
              {isConfigurationStep && (
                <Configuration
                  governance={governance}
                  initialData={fundsAllocationData}
                  onFinish={handleConfigurationFinish}
                />
              )}
              {step === FundsAllocationStep.Funds && (
                <FundDetails
                  governance={governance}
                  initialData={fundsAllocationData}
                  onFinish={handleFundDetailsFinish}
                  commonBalance={common.balance.amount}
                  commonMembers={commonMembers}
                  commonList={commons}
                />
              )}
            </>
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
