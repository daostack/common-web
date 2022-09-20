import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { CommonMember, Governance } from "@/shared/models";
import { BaseProposal } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { checkIsProposalTypeAllowedForMember } from "@/shared/utils";
import { ProposalTypeDetails } from "./ProposalTypeDetails";
import { useCreateProposalContext } from "../context";
import "./index.scss";

interface ProposalTypeOption extends DropdownOption {
  isDisabled: boolean;
}

const PROPOSAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    text: "Fund allocation",
    searchText: "Fund allocation",
    value: ProposalsTypes.FUNDS_ALLOCATION,
  },
  {
    text: "Survey",
    searchText: "Survey",
    value: ProposalsTypes.SURVEY,
  },
  {
    text: "Assign members to a circle",
    searchText: "Assign members to a circle",
    value: ProposalsTypes.ASSIGN_CIRCLE,
  },
  {
    text: "Remove members from a circle",
    searchText: "Remove members from a circle",
    value: ProposalsTypes.REMOVE_CIRCLE,
  },
  {
    text: "Delete common",
    searchText: "Delete common",
    value: ProposalsTypes.DELETE_COMMON,
  },
];

interface ProposalTypeSelectionProps {
  governance: Governance;
  commonMember: CommonMember;
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
  const { governance, commonMember, onFinish } = props;
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
  const proposalTypeOptions = useMemo<ProposalTypeOption[]>(() => {
    const proposalKeys = Object.keys(governance.proposals);

    return PROPOSAL_TYPE_OPTIONS.filter((option) =>
      proposalKeys.includes(option.value as string)
    ).map((option) => {
      const isDisabled = !checkIsProposalTypeAllowedForMember(
        commonMember,
        option.value as ProposalsTypes
      );

      return {
        ...option,
        isDisabled,
        className: isDisabled
          ? "proposal-type-selection-stage__type-dropdown-item--disabled"
          : "",
      };
    });
  }, [governance.proposals, commonMember]);

  const handleSelect = (value: unknown) => {
    const foundOption = proposalTypeOptions.find(
      (option) => option.value === value
    );

    if (foundOption && !foundOption.isDisabled) {
      setSelectedType(value as ProposalsTypes);
    }
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
        Proposals let the group to make decisions together.
      </p>
      <Separator className="proposal-type-selection-stage__separator" />
      <div className="proposal-type-selection-stage__form">
        <Dropdown
          options={proposalTypeOptions}
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
              circles={governance.circles}
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
