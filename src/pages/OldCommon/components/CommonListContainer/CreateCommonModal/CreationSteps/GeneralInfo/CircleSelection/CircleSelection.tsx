import React, { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IntermediateCreateCommonPayload } from "@/pages/OldCommon/interfaces";
import { Button, DropdownOption } from "@/shared/components";
import { Dropdown } from "@/shared/components";
import { ModalFooter } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";

interface GeneralInfoProps {
  onFinish: (circleId: string) => void;
  creationData: IntermediateCreateCommonPayload;
  governance: Governance;
  subCommons: Common[];
}

const CircleSelection: FC<GeneralInfoProps> = (props) => {
  const { onFinish, creationData, governance, subCommons } = props;
  const [selectedCircleId, setSelectedCircleId] = useState<string | undefined>(
    creationData.circleIdFromParent,
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const options = useMemo<DropdownOption[]>(
    () =>
      Object.values(governance.circles)
        .filter(
          (circle) =>
            !subCommons.some(
              (subCommon) => subCommon.directParent?.circleId === circle.id,
            ),
        )
        .map(
          (circle): DropdownOption => ({
            text: circle.name,
            searchText: circle.name,
            value: circle.id,
          }),
        ),
    [governance, subCommons],
  );

  const handleContinueClick = () => {
    if (selectedCircleId) {
      onFinish(selectedCircleId);
    }
  };

  const handleSelect = (newValue: unknown) => {
    setSelectedCircleId(newValue as string);
  };

  return (
    <>
      {options.length > 0 ? (
        <Dropdown
          label="Choose Circle from parent common"
          placeholder="---Select circle---"
          options={options}
          value={selectedCircleId}
          onSelect={handleSelect}
          shouldBeFixed={false}
        />
      ) : (
        <p className="create-common-general-info__empty-circles-text">
          There are no circles to select
        </p>
      )}
      <ModalFooter sticky>
        <div className="create-common-general-info__modal-footer">
          <Button
            onClick={handleContinueClick}
            shouldUseFullWidth={isMobileView}
            disabled={!selectedCircleId}
          >
            Continue
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};

export default CircleSelection;
