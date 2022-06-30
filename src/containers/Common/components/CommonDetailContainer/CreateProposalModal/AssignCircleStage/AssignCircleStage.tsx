import React, { FC, useEffect } from "react";
import { Governance } from "@/shared/models";
import { useCreateProposalContext } from "../context";
import { Configuration } from "./Configuration";
import "./index.scss";

interface AssignCircleStageProps {
  governance: Governance;
  onGoBack: () => void;
}

const AssignCircleStage: FC<AssignCircleStageProps> = (props) => {
  const { governance, onGoBack } = props;
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
  } = useCreateProposalContext();

  useEffect(() => {
    setTitle("Create New Proposal");
  }, [setTitle]);

  useEffect(() => {
    setOnGoBack(onGoBack);
  }, [setOnGoBack, onGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(true);
  }, [setShouldShowClosePrompt]);

  useEffect(() => {
    setShouldBeOnFullHeight(true);
  }, [setShouldBeOnFullHeight]);

  return (
    <div className="assign-circle-creation-stage">
      <Configuration governance={governance} />
    </div>
  );
};

export default AssignCircleStage;
