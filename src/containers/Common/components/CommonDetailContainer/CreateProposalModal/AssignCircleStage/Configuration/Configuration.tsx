import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  Autocomplete,
  AutocompleteOption,
  Button,
  Dropdown,
  DropdownOption,
  ModalFooter
} from "@/shared/components";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import AvatarIcon from "@/shared/icons/avatar.icon";
import {
  Circle,
  CommonMember,
  CommonMemberWithUserInfo,
  Governance,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { getUserName } from "@/shared/utils";
import { generateCirclesBinaryNumber } from "../../../CommonWhitepaper/utils";
import { StageName } from "../../StageName";
import { MemberInfo } from "../MemberInfo";
import { AssignCircleData } from "../types";
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  commonMember: CommonMember;
  commonMembers: CommonMemberWithUserInfo[];
  initialData: AssignCircleData | null;
  onFinish: (data: AssignCircleData) => void;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const {
    governance,
    commonMember: currentCommonMember,
    commonMembers,
    initialData,
    onFinish,
  } = props;
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
  const allowedCircleIndexesToBeAssigned = useMemo(
    () =>
      Object.entries(
        currentCommonMember.allowedProposals[ProposalsTypes.ASSIGN_CIRCLE] || {}
      )
        .filter(([, isAllowed]) => isAllowed)
        .map(([circleIndex]) => Number(circleIndex)),
    [currentCommonMember]
  );
  const circleIndex = governance.circles.findIndex(
    ({ id }) => id === circle?.id
  );
  const circleBinary =
    circleIndex >= 0 ? generateCirclesBinaryNumber([circleIndex]) : null;
  const circleOptions = useMemo<DropdownOption[]>(
    () =>
      governance.circles
        .filter((circle, index) =>
          allowedCircleIndexesToBeAssigned.includes(index)
        )
        .map((circle) => ({
          text: circle.name,
          searchText: circle.name,
          value: circle.id,
        })),
    [governance.circles, allowedCircleIndexesToBeAssigned]
  );
  const memberOptions = useMemo(
    () =>
      commonMembers.reduce<AutocompleteOption[]>(
        (acc, member) =>
          circleBinary !== null && !(member.circles & circleBinary)
            ? acc.concat({
                text: (
                  <MemberInfo
                    className="assign-circle-configuration__member-info"
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
    <div className="assign-circle-configuration">
      <StageName
        className="assign-circle-configuration__stage-name"
        name="Assign Circle"
        icon={
          <AvatarIcon className="assign-circle-configuration__avatar-icon" />
        }
      />
      <div className="assign-circle-configuration__form">
        {allowedCircleIndexesToBeAssigned.length > 0 ? (
          <Dropdown
            className="assign-circle-configuration__circle-dropdown"
            options={circleOptions}
            value={circle?.id}
            onSelect={handleCircleSelect}
            label="Circle to Assign"
            placeholder="Select Circle"
            shouldBeFixed={false}
          />
        ) : (
          <p className="assign-circle-configuration__info-text">
            You don’t have permissions to assign circles
          </p>
        )}
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
              <p className="assign-circle-configuration__info-text">
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
            {isMobileView ? "Continue" : "Create Proposal"}
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
};

export default Configuration;
