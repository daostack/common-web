import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { useCommonMembers } from "@/containers/Common/hooks";
import { CreateProposal } from "@/containers/Common/interfaces";
import { createAssignCircleProposal } from "@/containers/Common/store/actions";
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
import { AssignCircleStep } from "./constants";
import { AssignCircleData } from "./types";
import "./index.scss";

interface AssignCircleStageProps {
  common: Common;
  governance: Governance;
  onFinish: (shouldViewProposal?: boolean) => void;
  onGoBack: () => void;
}

const AssignCircleStage: FC<AssignCircleStageProps> = (props) => {
  const { common, governance, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const [assignCircleData, setAssignCircleData] =
    useState<AssignCircleData | null>(null);
  const [step, setStep] = useState(AssignCircleStep.Configuration);
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
  const isConfigurationStep = step === AssignCircleStep.Configuration;
  const isSuccessStep = step === AssignCircleStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;

  const handleConfigurationFinish = (data: AssignCircleData) => {
    setAssignCircleData(data);
    setStep(AssignCircleStep.Confirmation);
  };

  const handleConfirm = () => {
    if (!assignCircleData || !user) {
      return;
    }

    setIsProposalCreating(true);
    const payload: Omit<
      CreateProposal[ProposalsTypes.ASSIGN_CIRCLE]["data"],
      "type"
    > = {
      args: {
        commonId: common.id,
        // TODO: Use here name of common member
        title: `Assign circle proposal for ${getUserName(
          assignCircleData.commonMember.user
        )}`,
        description: `Request from ${getUserName(user)}`,
        images: [],
        links: [],
        files: [],
        circleId: assignCircleData.circle.id,
      },
    };

    dispatch(
      createAssignCircleProposal.request({
        payload,
        callback: (error, data) => {
          if (!error && data) {
            setStep(AssignCircleStep.Success);
            setIsProposalCreating(false);
          }
        },
      })
    );
  };

  const handleConfirmationCancel = () => {
    setStep(AssignCircleStep.Configuration);
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
    setOnGoBack(shouldShowModalTitle ? onGoBack : undefined);
  }, [setOnGoBack, onGoBack, shouldShowModalTitle]);

  useEffect(() => {
    setShouldShowClosePrompt(!isSuccessStep);
  }, [setShouldShowClosePrompt, isSuccessStep]);

  useEffect(() => {
    setShouldBeOnFullHeight(isConfigurationStep);
  }, [setShouldBeOnFullHeight, isConfigurationStep]);

  const renderConfirmationStep = () =>
    assignCircleData && (
      <Confirmation
        circle={assignCircleData.circle}
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
    <div className="assign-circle-creation-stage">
      {!areCommonMembersFetched && <Loader />}
      {areCommonMembersFetched && (
        <>
          {(isConfigurationStep || isMobileView) && (
            <Configuration
              governance={governance}
              commonMembers={commonMembers}
              initialData={assignCircleData}
              onFinish={handleConfigurationFinish}
            />
          )}
          {step === AssignCircleStep.Confirmation &&
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

export default AssignCircleStage;
