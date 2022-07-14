import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { useCommonMembers } from "@/containers/Common/hooks";
import { CreateProposal } from "@/containers/Common/interfaces";
import { createFundingProposal } from "@/containers/Common/store/actions";
import { Loader, Modal } from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { FundDetails } from "./FundDetails";
import { Success } from "./Success";
import { FundsAllocationStep } from "./constants";
import { FundsAllocationData } from "./types";
import "./index.scss";

interface FundsAllocationStageProps {
  common: Common;
  governance: Governance;
  onFinish: (shouldViewProposal?: boolean) => void;
  onGoBack: () => void;
}

const FundsAllocationStage: FC<FundsAllocationStageProps> = (props) => {
  const { common, governance, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const [fundsAllocationData, setfundsAllocationData] =
    useState<FundsAllocationData | null>(null);
  const [step, setStep] = useState(FundsAllocationStep.Configuration);
  const [isProposalCreating, setIsProposalCreating] = useState(false);
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
  } = useCreateProposalContext();
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers();
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isConfigurationStep = step === FundsAllocationStep.Configuration;
  const isSuccessStep = step === FundsAllocationStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;
  const isLoading = !areCommonMembersFetched || isProposalCreating;

  const handleConfigurationFinish = (data: FundsAllocationData) => {
    setfundsAllocationData(data);
    setStep(FundsAllocationStep.Funds);
  };

  const handleFundDetailsFinish = (data: FundsAllocationData) => {
    console.log('data', data, 'fundsAllocationData', fundsAllocationData)
    setfundsAllocationData(data);
    setStep(FundsAllocationStep.Confirmation);
  };

  const handleConfirm = () => {
    if (!fundsAllocationData || !user) {
      return;
    }

    setIsProposalCreating(true);
    const payload: Omit<
      CreateProposal[ProposalsTypes.FUNDS_ALLOCATION]["data"],
      "type"
    > = {
      args: {
        //commonId: common.id,
        // TODO: Use here name of common member
        title: fundsAllocationData.title,
        description: fundsAllocationData.description, //`Request from ${getUserName(user)}`,
        //proposerId: user.id,
        //goalOfPayment: fundsAllocationData.goalOfPayment,
        //images: [],
        //links: [],
        //files: [],
        //circleId: '',
        //userId: '' //fundsAllocationData.commonMember.userId
      },
    };

    dispatch(
      createFundingProposal.request({
        payload,
        callback: (error, data) => {
          if (!error && data) {
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
    onFinish(false);
  };

  const handleViewProposal = () => {
    onFinish(true);
  };

  useEffect(() => {
    fetchCommonMembers(governance.commonId);
  }, [fetchCommonMembers, governance.commonId]);

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

  const renderConfirmationStep = () => <></>
    /*fundsAllocationData && (
      <Confirmation
        circle={fundsAllocationData.circle}
        commonMember={fundsAllocationData.commonMember}
        onSubmit={handleConfirm}
        onCancel={handleConfirmationCancel}
      />
    );*/



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
              //commonMembers={commonMembers}
              initialData={fundsAllocationData}
              onFinish={handleConfigurationFinish}
            />
          )}

          {(step === FundsAllocationStep.Funds || isMobileView) &&
              <FundDetails
              governance={governance}
              //commonMembers={commonMembers}
              initialData={fundsAllocationData}
              onFinish={handleFundDetailsFinish}
            />
           }
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
