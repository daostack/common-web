import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "@/pages/Auth/store/selectors";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { createDeleteCommonProposal } from "@/pages/OldCommon/store/actions";
import { Loader, Modal } from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { Common, Proposal } from "@/shared/models";
import { DeleteCommon } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { Success } from "./Success";
import { DeleteCommonStep } from "./constants";
import { useActiveProposalsCheck } from "./hooks";
import { DeleteCommonData } from "./types";
import "./index.scss";

interface DeleteCommonStageProps {
  common: Common;
  activeProposalsExist?: boolean;
  onFinish: (proposal?: Proposal) => void;
  onGoBack: () => void;
}

const DeleteCommonStage: FC<DeleteCommonStageProps> = (props) => {
  const { common, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const [deleteCommonData, setDeleteCommonData] =
    useState<DeleteCommonData | null>(null);
  const [step, setStep] = useState(DeleteCommonStep.Configuration);
  const [isProposalCreating, setIsProposalCreating] = useState(false);
  const [createdProposal, setCreatedProposal] = useState<DeleteCommon | null>(
    null,
  );
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
    onError,
  } = useCreateProposalContext();
  const {
    data: activeProposalsExistRaw,
    fetched: areActiveProposalsChecked,
    checkActiveProposals,
  } = useActiveProposalsCheck(props.activeProposalsExist);
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isConfigurationStep = step === DeleteCommonStep.Configuration;
  const isSuccessStep = step === DeleteCommonStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;
  const activeProposalsExist = activeProposalsExistRaw ?? true;
  const isLoading = isProposalCreating || !areActiveProposalsChecked;

  const handleConfigurationFinish = (data: DeleteCommonData) => {
    setDeleteCommonData(data);
    setStep(DeleteCommonStep.Confirmation);
  };

  const handleConfirm = () => {
    if (!deleteCommonData || !user) {
      return;
    }

    setIsProposalCreating(true);
    const proposalId = uuidv4();
    const discussionId = uuidv4();
    const payload: Omit<
      CreateProposal[ProposalsTypes.DELETE_COMMON]["data"],
      "type"
    > = {
      args: {
        id: proposalId,
        discussionId,
        commonId: common.id,
        title: `Delete common proposal from ${getUserName(user)}`,
        description: deleteCommonData.description,
        images: [],
        links: [],
        files: [],
      },
    };

    dispatch(
      createDeleteCommonProposal.request({
        payload,
        callback: (error, data) => {
          if (error || !data) {
            onError(error?.message || "Something went wrong");
            return;
          }

          setCreatedProposal(data);
          setStep(DeleteCommonStep.Success);
          setIsProposalCreating(false);
        },
      }),
    );
  };

  const handleConfirmationCancel = () => {
    setStep(DeleteCommonStep.Configuration);
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

  useEffect(() => {
    if (typeof props.activeProposalsExist === "undefined") {
      checkActiveProposals(common.id);
    }
  }, [props.activeProposalsExist]);

  const renderConfirmationStep = () =>
    deleteCommonData && (
      <Confirmation
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
    <div className="delete-common-creation-stage">
      {isLoading && <Loader />}
      {!isLoading && (
        <>
          {(isConfigurationStep || isMobileView) && (
            <Configuration
              commonBalance={common.balance.amount}
              activeProposalsExist={activeProposalsExist}
              initialData={deleteCommonData}
              onFinish={handleConfigurationFinish}
            />
          )}
          {step === DeleteCommonStep.Confirmation &&
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

export default DeleteCommonStage;
