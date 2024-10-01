import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { CreateProposal } from "@/pages/OldCommon/interfaces";
import { createSurvey } from "@/pages/OldCommon/store/actions";
import { Loader, Modal } from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { Common, Governance, CommonLink, Proposal } from "@/shared/models";
import { Survey, ProposalImage } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { parseLinksForSubmission } from "@/shared/utils";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { Success } from "./Success";
import { SurveyStep } from "./constants";
import { SurveyData } from "./types";
import "./index.scss";

interface SurveyStageProps {
  common: Common;
  governance: Governance;
  onFinish: (proposal?: Proposal) => void;
  onGoBack: () => void;
}

const initialFundsData = {
  title: "title",
  description: "description",
  links: [] as CommonLink[],
  images: [] as ProposalImage[],
};

const SurveyStage: FC<SurveyStageProps> = (props) => {
  const { common, governance, onFinish, onGoBack } = props;
  const dispatch = useDispatch();
  const [surveyData, setSurveyData] = useState<SurveyData>(initialFundsData);
  const [step, setStep] = useState(SurveyStep.Configuration);
  const [isProposalCreating, setIsProposalCreating] = useState(false);
  const [createdProposal, setCreatedProposal] = useState<Survey | null>(null);
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
    onError,
  } = useCreateProposalContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isConfigurationStep = step === SurveyStep.Configuration;
  const isSuccessStep = step === SurveyStep.Success;
  const shouldShowModalTitle = isMobileView || isConfigurationStep;

  const handleConfigurationFinish = (data: SurveyData) => {
    const links = parseLinksForSubmission(data.links);

    setSurveyData((surveyData) => ({
      ...surveyData,
      ...data,
      links,
    }));
    setStep(SurveyStep.Confirmation);
  };

  const handleConfirm = () => {
    if (!surveyData) {
      return;
    }

    setIsProposalCreating(true);

    const proposalId = uuidv4();
    const discussionId = uuidv4();
    const payload: Omit<CreateProposal[ProposalsTypes.SURVEY]["data"], "type"> =
      {
        args: {
          id: proposalId,
          discussionId,
          description: surveyData.description,
          commonId: common.id,
          title: surveyData.title,
          images: surveyData.images as ProposalImage[],
          links: surveyData.links,
          files: [],
        },
      };

    dispatch(
      createSurvey.request({
        payload,
        callback: (error, data) => {
          if (error || !data) {
            onError(error?.message || "Something went wrong");
            return;
          }

          setCreatedProposal(data);
          setStep(SurveyStep.Success);
          setIsProposalCreating(false);
        },
      }),
    );
  };

  const handleConfirmationCancel = () => {
    setStep(SurveyStep.Configuration);
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
    setShouldBeOnFullHeight(isConfigurationStep || isProposalCreating);
  }, [setShouldBeOnFullHeight, isConfigurationStep, isProposalCreating]);

  const renderConfirmationStep = () =>
    surveyData && (
      <Confirmation
        surveyData={surveyData}
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
    <div className="survey-creation-stage">
      {isProposalCreating && <Loader />}
      {!isProposalCreating && (
        <>
          {(isConfigurationStep || isMobileView) && (
            <Configuration
              governance={governance}
              initialData={surveyData}
              onFinish={handleConfigurationFinish}
            />
          )}
          {step === SurveyStep.Confirmation &&
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

export default SurveyStage;
