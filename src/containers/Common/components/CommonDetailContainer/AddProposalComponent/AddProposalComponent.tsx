import React, { useMemo, useState } from "react";

import { Modal } from "../../../../../shared/components";
import { ModalProps } from "@/shared/interfaces";

import "./index.scss";
import { Common } from "@/shared/models";
import { AddProposalForm } from "./AddProposalForm";
import { AddProposalConfirm } from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddProposalConfirm";
import AddProposalLoader from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent/AddProposalLoader";

interface AddDiscussionComponentProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  onProposalAdd: (payload: any) => void;
  common: Common;
}

const AddProposalComponent = ({
  isShowing,
  onClose,
  onProposalAdd,
  common,
}: AddDiscussionComponentProps) => {
  const [proposalCreationStep, changeCreationProposalStep] = useState("loader");

  const renderProposalStep = useMemo(() => {
    switch (proposalCreationStep) {
      case "create":
        return (
          <AddProposalForm onProposalAdd={onProposalAdd} common={common} />
        );
      case "confirm":
        return <AddProposalConfirm />;
      case "loader":
        return <AddProposalLoader />;
      default:
        return (
          <AddProposalForm onProposalAdd={onProposalAdd} common={common} />
        );
    }
  }, [onProposalAdd, proposalCreationStep, common]);

  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      {renderProposalStep}
    </Modal>
  );
};

export default AddProposalComponent;
