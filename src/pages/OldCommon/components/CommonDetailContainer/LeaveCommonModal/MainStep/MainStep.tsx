import React, { FC, useState } from "react";
import { Checkbox, ErrorText } from "@/shared/components/Form";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import "./index.scss";

interface MainStepProps {
  isLoading: boolean;
  errorText: string;
  onLeave: () => void;
  onCancel: () => void;
  isSubCommon: boolean;
}

const MainStep: FC<MainStepProps> = (props) => {
  const { isLoading, errorText, onLeave, onCancel, isSubCommon } = props;
  const [isApproved, setIsApproved] = useState(false);
  const isLeaveButtonDisabled = isLoading || !isApproved;
  const commonWord = isSubCommon ? "Space" : "Common";

  const handleApprovalChange = () => {
    setIsApproved((value) => !value);
  };

  return (
    <div className="leave-common-main-step">
      <p className="leave-common-main-step__text">
        Before you leave the {commonWord}, here are some things:
      </p>
      <ol className="leave-common-main-step__ordered-list">
        <li>
          You will no longer have access to all the {commonWord}’s proposals,
          discussions, wallet transactions, etc. either as reader, or writer
          according to the {commonWord}’s governance
        </li>
        <li>
          Proposals that are assigned to you (funds transfer, circles) will be
          cancelled
        </li>
        <li>You will be removed from the {commonWord}’s member list</li>
        <li>Your monthly contributions will no longer be charged</li>
      </ol>
      <Checkbox
        name="infoApproval"
        label="I understand and approve"
        checked={isApproved}
        onChange={handleApprovalChange}
        disabled={isLoading}
        styles={{
          label: "leave-common-main-step__checkbox-label",
        }}
      />
      <ErrorText className="leave-common-main-step__error-text">
        {errorText}
      </ErrorText>
      <div className="leave-common-main-step__buttons-wrapper">
        <Button
          className="leave-common-main-step__button"
          onClick={onCancel}
          variant={ButtonVariant.OutlineDarkPink}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant={ButtonVariant.PrimaryPink}
          className="leave-common-main-step__button"
          onClick={onLeave}
          disabled={isLeaveButtonDisabled}
        >
          Leave {commonWord}
        </Button>
      </div>
    </div>
  );
};

export default MainStep;
