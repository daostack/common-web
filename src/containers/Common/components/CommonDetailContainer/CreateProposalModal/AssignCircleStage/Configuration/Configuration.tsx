import React, { FC, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ProposalsTypes } from "@/shared/constants";
import AvatarIcon from "@/shared/icons/avatar.icon";
import { StageName } from "../../StageName";
import "./index.scss";

const PROPOSAL_TYPE_OPTIONS: DropdownOption[] = [
  {
    text: "Assign Circle",
    searchText: "Assign Circle",
    value: ProposalsTypes.ASSIGN_CIRCLE,
  },
];

const Configuration: FC = () => {
  const [circle, setCircle] = useState<string | null>(null);

  const handleCircleSelect = (value: unknown) => {
    setCircle(value as string);
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
          options={PROPOSAL_TYPE_OPTIONS}
          value={circle}
          onSelect={handleCircleSelect}
          label="Circle to Assign"
          placeholder="Select Circle"
          shouldBeFixed={false}
        />
        <Dropdown
          className="assign-circle-configuration__member-dropdown"
          options={PROPOSAL_TYPE_OPTIONS}
          value={circle}
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
            Continue
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
};

export default Configuration;
