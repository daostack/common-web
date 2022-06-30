import React, { FC, useEffect, useState } from "react";
import { ProposalsTypes } from "@/shared/constants";
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
  const [selectedType, setSelectedType] = useState<ProposalsTypes | null>(null);

  const handleSelect = (value: unknown) => {
    setSelectedType(value as ProposalsTypes);
  };

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
      <Configuration />
    </div>
  );
};

export default AssignCircleStage;
