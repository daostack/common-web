import React, { FC, useEffect } from "react";
import { useCommonMembers } from "@/containers/Common/hooks";
import { Loader } from "@/shared/components";
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
  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers();

  useEffect(() => {
    fetchCommonMembers(governance.commonId);
  }, [fetchCommonMembers, governance.commonId]);

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
      {!areCommonMembersFetched && <Loader />}
      {areCommonMembersFetched && (
        <Configuration governance={governance} commonMembers={commonMembers} />
      )}
    </div>
  );
};

export default AssignCircleStage;
