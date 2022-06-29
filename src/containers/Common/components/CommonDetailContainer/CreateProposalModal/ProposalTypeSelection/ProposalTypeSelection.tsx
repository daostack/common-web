import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ProposalsTypes } from "@/shared/constants";
import { useCreateProposalContext } from "../context";
import "./index.scss";

const PROPOSAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    text: "Assign Circle",
    searchText: "Assign Circle",
    value: ProposalsTypes.ASSIGN_CIRCLE,
  },
];

const ProposalTypeSelection: FC = () => {
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
    setOnGoBack();
  }, [setOnGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(true);
  }, [setShouldShowClosePrompt]);

  useEffect(() => {
    setShouldBeOnFullHeight(true);
  }, [setShouldBeOnFullHeight]);

  return (
    <div className="proposal-type-selection-stage">
      <p className="proposal-type-selection-stage__description">
        Proposals allow you to make decisions as a group. If you choose to
        request funding and the proposal is accepted, you will be responsible to
        follow it through.
      </p>
      <Separator className="proposal-type-selection-stage__separator" />
      <div className="proposal-type-selection-stage__form">
        <Dropdown
          options={PROPOSAL_TYPE_OPTIONS}
          value={selectedType}
          onSelect={handleSelect}
          label="Type of proposal"
          placeholder="Select Type"
          shouldBeFixed={false}
        />
      </div>
      <ModalFooter sticky>
        <div className="proposal-type-selection-stage__modal-footer">
          <Button
            className="proposal-type-selection-stage__submit-button"
            onClick={() => {}}
            shouldUseFullWidth
          >
            Continue
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
};

export default ProposalTypeSelection;
