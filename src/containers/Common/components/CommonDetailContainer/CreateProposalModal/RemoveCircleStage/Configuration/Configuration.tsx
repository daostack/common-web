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
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import AvatarIcon from "@/shared/icons/avatar.icon";
import { Circle, CommonMemberWithUserInfo, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { generateCirclesBinaryNumber } from "../../../CommonWhitepaper/utils";
import { StageName } from "../../StageName";
import { MemberInfo } from "../MemberInfo";
import { RemoveCircleData } from "../types";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  commonMembers: CommonMemberWithUserInfo[];
  initialData: RemoveCircleData | null;
  onFinish: (data: RemoveCircleData) => void;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { governance, commonMembers, initialData, onFinish } = props;
  const isInitialCircleUpdate = useRef(true);
  const [circle, setCircle] = useState<Circle | null>(
    initialData?.circle || null
  );
  const [commonMember, setCommonMember] =
    useState<CommonMemberWithUserInfo | null>(
      initialData?.commonMember || null
    );
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
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
              text: (
                <MemberInfo
                  className="remove-circle-configuration__member-info"
                  user={member.user}
                />
              ),
              searchText: getUserName(member.user),
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
    <div className="remove-circle-configuration">
      <StageName
        className="remove-circle-configuration__stage-name"
        name="Remove Circle"
        icon={
          <AvatarIcon className="remove-circle-configuration__avatar-icon" />
        }
      />
      <div className="remove-circle-configuration__form">
        <Dropdown
          className="remove-circle-configuration__circle-dropdown"
          options={circleOptions}
          value={circle?.id}
          onSelect={handleCircleSelect}
          label="Circle to Remove"
          placeholder="Select Circle"
          shouldBeFixed={false}
        />
        {circle && (
          <>
            {memberOptions.length > 0 ? (
              <Autocomplete
                className="remove-circle-configuration__member-autocomplete"
                options={memberOptions}
                value={commonMember?.id}
                onSelect={handleCommonMemberSelect}
                label="Member"
                placeholder="Select Member"
                shouldBeFixed={false}
              />
            ) : (
              <p className="remove-circle-configuration__no-members-text">
                There are no common members to remove selected circle.
              </p>
            )}
          </>
        )}
      </div>
      <ModalFooter sticky>
        <div className="remove-circle-configuration__modal-footer">
          <Button
            key="remove-circle-configuration"
            className="remove-circle-configuration__submit-button"
            onClick={handleContinue}
            disabled={!commonMember}
            shouldUseFullWidth
          >
            {isMobileView ? "Continue" : "Create Proposal"}
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
};

export default Configuration;
