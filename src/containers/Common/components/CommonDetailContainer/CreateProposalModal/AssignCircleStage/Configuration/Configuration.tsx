import React, { FC, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ProposalsTypes } from "@/shared/constants";
import AvatarIcon from "@/shared/icons/avatar.icon";
import { Governance } from "@/shared/models";
import { StageName } from "../../StageName";
import "./index.scss";

const PROPOSAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    text: "Assign Circle",
    searchText: "Assign Circle",
    value: ProposalsTypes.ASSIGN_CIRCLE,
  },
];

interface ConfigurationProps {
  governance: Governance;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { governance } = props;
  const [circleId, setCircleId] = useState<string | null>(null);
  const circleOptions = useMemo<DropdownOption[]>(
    () =>
      governance.circles.map((circle) => ({
        text: circle.name,
        searchText: circle.name,
        value: circle.id,
      })),
    [governance.circles]
  );

  const handleCircleSelect = (value: unknown) => {
    setCircleId(value as string);
  };

  return (
    <div className="assign-circle-configuration">
      <StageName
        className="assign-circle-configuration__stage-name"
        name="Assign Circle"
        icon={
          <AvatarIcon className="assign-circle-configuration__avatar-icon" />
        }
      />
      <Separator className="assign-circle-configuration__separator" />
      <div className="assign-circle-configuration__form">
        <Dropdown
          className="assign-circle-configuration__circle-dropdown"
          options={circleOptions}
          value={circleId}
          onSelect={handleCircleSelect}
          label="Circle to Assign"
          placeholder="Select Circle"
          shouldBeFixed={false}
        />
        <Dropdown
          className="assign-circle-configuration__member-dropdown"
          options={PROPOSAL_TYPE_OPTIONS}
          value={circleId}
          onSelect={handleCircleSelect}
          label="Member"
          placeholder="Select Member"
          shouldBeFixed={false}
        />
      </div>
      <ModalFooter sticky>
        <div className="assign-circle-configuration__modal-footer">
          <Button
            key="assign-circle-configuration"
            className="assign-circle-configuration__submit-button"
            onClick={() => {}}
            disabled={false}
            shouldUseFullWidth
          >
            Create Proposal
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
};

export default Configuration;
