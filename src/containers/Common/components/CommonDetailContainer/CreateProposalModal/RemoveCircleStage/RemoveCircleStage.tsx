import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { useCommonMembers } from "@/containers/Common/hooks";
import { CreateProposal } from "@/containers/Common/interfaces";
import { createRemoveCircleProposal } from "@/containers/Common/store/actions";
import { Loader, Modal } from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { Success } from "./Success";
import { RemoveCircleStep } from "./constants";
import { RemoveCircleData } from "./types";
import "./index.scss";

interface RemoveCircleStageProps {
  common: Common;
  governance: Governance;
  onFinish: (shouldViewProposal?: boolean) => void;
  onGoBack: () => void;
}

const RemoveCircleStage: FC<RemoveCircleStageProps> = (props) => {
  const { common, governance, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const [removeCircleData, setRemoveCircleData] =
    useState<RemoveCircleData | null>(null);
  const [step, setStep] = useState(RemoveCircleStep.Configuration);
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
  const isConfigurationStep = step === RemoveCircleStep.Configuration;
  const isSuccessStep = step === RemoveCircleStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;
  const isLoading = !areCommonMembersFetched || isProposalCreating;

  const handleConfigurationFinish = (data: RemoveCircleData) => {
    setRemoveCircleData(data);
    setStep(RemoveCircleStep.Confirmation);
  };

  const handleConfirm = () => {
    if (!removeCircleData || !user) {
      return;
    }

    setIsProposalCreating(true);
    const payload: Omit<
      CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"],
      "type"
    > = {
      args: {
        commonId: common.id,
        title: `Remove circle proposal for ${getUserName(
          removeCircleData.commonMember.user
        )}`,
        description: `Request from ${getUserName(user)}`,
        images: [],
        links: [],
        files: [],
        circleId: removeCircleData.circle.id,
        userId: removeCircleData.commonMember.userId
      },
    };

    dispatch(
      createRemoveCircleProposal.request({
        payload,
        callback: (error, data) => {
          if (!error && data) {
            setStep(RemoveCircleStep.Success);
            setIsProposalCreating(false);
          }
        },
      })
    );
  };

  const handleConfirmationCancel = () => {
    setStep(RemoveCircleStep.Configuration);
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

  const renderConfirmationStep = () =>
    removeCircleData && (
      <Confirmation
        circle={removeCircleData.circle}
        commonMember={removeCircleData.commonMember}
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
    <div className="remove-circle-creation-stage">
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          {(isConfigurationStep || isMobileView) && (
            <Configuration
              governance={governance}
              commonMembers={commonMembers}
              initialData={removeCircleData}
              onFinish={handleConfigurationFinish}
            />
          )}
          {step === RemoveCircleStep.Confirmation &&
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

export default RemoveCircleStage;
