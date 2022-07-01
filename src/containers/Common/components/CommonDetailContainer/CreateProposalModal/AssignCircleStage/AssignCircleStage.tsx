import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCommonMembers } from "@/containers/Common/hooks";
import { Loader } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import { Confirmation } from "./Confirmation";
import { AssignCircleData } from "./types";
import "./index.scss";

interface AssignCircleStageProps {
  governance: Governance;
  onGoBack: () => void;
}

const AssignCircleStage: FC<AssignCircleStageProps> = (props) => {
  const { governance, onGoBack } = props;
  const [assignCircleData, setAssignCircleData] =
    useState<AssignCircleData | null>(null);
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);
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
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const shouldShowModalTitle = isMobileView || !isConfirmationStep;

  const handleConfigurationFinish = (data: AssignCircleData) => {
    setAssignCircleData(data);
    setIsConfirmationStep(true);
  };

  const handleConfirm = () => {
    if (!assignCircleData) {
      return;
    }
    // Create proposal
  };

  const handleConfirmationCancel = () => {
    setIsConfirmationStep(false);
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
    setShouldShowClosePrompt(true);
  }, [setShouldShowClosePrompt]);

  useEffect(() => {
    setShouldBeOnFullHeight(true);
  }, [setShouldBeOnFullHeight]);

  return (
    <div className="assign-circle-creation-stage">
      {!areCommonMembersFetched && <Loader />}
      {areCommonMembersFetched && (
        <>
          {(isMobileView || !isConfirmationStep) && (
            <Configuration
              governance={governance}
              commonMembers={commonMembers}
              initialData={assignCircleData}
              onFinish={handleConfigurationFinish}
            />
          )}
          {isConfirmationStep && assignCircleData && (
            <Confirmation
              circle={assignCircleData.circle}
              onSubmit={handleConfirm}
              onCancel={handleConfirmationCancel}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AssignCircleStage;
