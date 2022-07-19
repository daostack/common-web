import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { Governance } from "@/shared/models";
import { BaseProposal } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { ProposalTypeDetails } from "./ProposalTypeDetails";
import { useCreateProposalContext } from "../context";
import "./index.scss";

const PROPOSAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    text: "Assign Circle",
    searchText: "Assign Circle",
    value: ProposalsTypes.ASSIGN_CIRCLE,
  },
  {
    text: "Funds Allocation",
    searchText: "Funds Allocation",
    value: ProposalsTypes.FUNDS_ALLOCATION,
  },
];

interface ProposalTypeSelectionProps {
  governance: Governance;
  onFinish: (proposalType: ProposalsTypes) => void;
}

const getProposalTypeDetails = (
  governance: Governance,
  proposalType: ProposalsTypes
): Pick<BaseProposal, "global"> | null => {
  if (
    [ProposalsTypes.ASSIGN_CIRCLE, ProposalsTypes.REMOVE_CIRCLE].includes(
      proposalType
    )
  ) {
    return governance.proposals[proposalType][1] || null;
  }

  return governance.proposals[proposalType] || null;
};

const ProposalTypeSelection: FC<ProposalTypeSelectionProps> = (props) => {
  const { governance, onFinish } = props;
  const {
    setTitle,
    setOnGoBack,
    setShouldShowClosePrompt,
    setShouldBeOnFullHeight,
  } = useCreateProposalContext();
  const [selectedType, setSelectedType] = useState<ProposalsTypes | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const proposalTypeDetails =
    selectedType && getProposalTypeDetails(governance, selectedType);

  const handleSelect = (value: unknown) => {
    setSelectedType(value as ProposalsTypes);
  };

  const handleContinue = () => {
    if (selectedType) {
      onFinish(selectedType);
    }
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
        {proposalTypeDetails && (
          <>
            {isMobileView && (
              <h4 className="proposal-type-selection-stage__disclaimer-title">
                Disclaimer
              </h4>
            )}
            <ProposalTypeDetails
              className="proposal-type-selection-stage__details"
              data={proposalTypeDetails}
            />
          </>
        )}
      </div>
      <ModalFooter sticky>
        <div className="proposal-type-selection-stage__modal-footer">
          <Button
            key="proposal-type-selection"
            className="proposal-type-selection-stage__submit-button"
            onClick={handleContinue}
            disabled={!proposalTypeDetails}
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
