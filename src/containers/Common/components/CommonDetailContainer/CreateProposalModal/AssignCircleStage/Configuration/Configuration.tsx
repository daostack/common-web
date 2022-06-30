import React, { FC, useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteOption,
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
  Separator,
} from "@/shared/components";
import AvatarIcon from "@/shared/icons/avatar.icon";
import { Governance } from "@/shared/models";
import { StageName } from "../../StageName";
import "./index.scss";

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
  const memberOptions = useMemo<AutocompleteOption[]>(
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

  const handleMemberSelect = (value: unknown) => {
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
        <Autocomplete
          className="assign-circle-configuration__member-autocomplete"
          options={memberOptions}
          value={circleId}
          onSelect={handleMemberSelect}
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
