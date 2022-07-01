import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
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
import { Circle, CommonMember, Governance } from "@/shared/models";
import { generateCirclesBinaryNumber } from "../../../CommonWhitepaper/utils";
import { StageName } from "../../StageName";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  commonMembers: CommonMember[];
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { governance, commonMembers } = props;
  const [circle, setCircle] = useState<Circle | null>(null);
  const [commonMemberId, setCommonMemberId] = useState<string | null>(null);
  const user = useSelector(selectUser());
  const circleIndex = governance.circles.findIndex(
    ({ id }) => id === circle?.id
  );
  const circleBinary =
    circleIndex >= 0 ? generateCirclesBinaryNumber([circleIndex]) : null;
  const circleOptions = useMemo<DropdownOption[]>(
    () =>
      governance.circles.map((circle) => ({
        text: circle.name,
        searchText: circle.name,
        value: circle.id,
      })),
    [governance.circles]
  );
  const memberOptions = useMemo(
    () =>
      commonMembers.reduce<AutocompleteOption[]>(
        (acc, commonMember) =>
          commonMember.userId !== user?.uid &&
          circleBinary !== null &&
          !(commonMember.circles & circleBinary)
            ? acc.concat({
                text: commonMember.circles.toString(),
                searchText: commonMember.circles.toString(),
                value: commonMember.id,
              })
            : acc,
        []
      ),
    [commonMembers, user?.uid, circleBinary]
  );

  const handleCircleSelect = (selectedCircleId: unknown) => {
    const circle = governance.circles.find(({ id }) => id === selectedCircleId);
    setCircle(circle || null);
  };

  const handleCommonMemberSelect = (value: unknown) => {
    setCommonMemberId(value as string);
  };

  useEffect(() => {
    setCommonMemberId(null);
  }, [circle?.id]);

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
          value={circle?.id}
          onSelect={handleCircleSelect}
          label="Circle to Assign"
          placeholder="Select Circle"
          shouldBeFixed={false}
        />
        {circle && (
          <>
            {memberOptions.length > 0 ? (
              <Autocomplete
                className="assign-circle-configuration__member-autocomplete"
                options={memberOptions}
                value={commonMemberId}
                onSelect={handleCommonMemberSelect}
                label="Member"
                placeholder="Select Member"
                shouldBeFixed={false}
              />
            ) : (
              <p className="assign-circle-configuration__no-members-text">
                There are no common members to assign selected circle.
              </p>
            )}
          </>
        )}
      </div>
      <ModalFooter sticky>
        <div className="assign-circle-configuration__modal-footer">
          <Button
            key="assign-circle-configuration"
            className="assign-circle-configuration__submit-button"
            onClick={() => {}}
            disabled={!commonMemberId}
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
