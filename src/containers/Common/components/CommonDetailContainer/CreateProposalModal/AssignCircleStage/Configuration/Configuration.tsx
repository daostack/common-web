import React, { FC, useEffect, useMemo, useRef, useState } from "react";
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
import { AssignCircleData } from "../types";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  commonMembers: CommonMember[];
  initialData: AssignCircleData | null;
  onFinish: (data: AssignCircleData) => void;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { governance, commonMembers, initialData, onFinish } = props;
  const isInitialCircleUpdate = useRef(true);
  const [circle, setCircle] = useState<Circle | null>(
    initialData?.circle || null
  );
  const [commonMember, setCommonMember] = useState<CommonMember | null>(
    initialData?.commonMember || null
  );
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
        (acc, member) =>
          member.userId !== user?.uid &&
          circleBinary !== null &&
          !(member.circles & circleBinary)
            ? acc.concat({
                text: member.circles.toString(),
                searchText: member.circles.toString(),
                value: member.id,
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

  const handleCommonMemberSelect = (selectedCommonMemberId: unknown) => {
    const member = commonMembers.find(
      ({ id }) => id === selectedCommonMemberId
    );
    setCommonMember(member || null);
  };

  const handleContinue = () => {
    if (circle && commonMember) {
      onFinish({ circle, commonMember });
    }
  };

  useEffect(() => {
    if (isInitialCircleUpdate.current) {
      isInitialCircleUpdate.current = false;
      return;
    }

    setCommonMember(null);
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
                value={commonMember?.id}
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
            onClick={handleContinue}
            disabled={!commonMember}
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
