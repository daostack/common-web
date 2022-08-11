import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { SurveyData } from "../types";
import "./index.scss";

interface ConfirmationProps {
  surveyData: SurveyData;
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { surveyData, onSubmit, onCancel } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="survey-confirmation">
      <img
        className="survey-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="survey-confirmation__title">Survey</h4>
      <p className="survey-confirmation__circle-name">{surveyData.title}</p>
      <p className="survey-confirmation__circle-name">{surveyData.description}</p>
      <div className="survey-confirmation__buttons-wrapper">
        <Button
          className="survey-confirmation__cancel-button"
          onClick={onCancel}
          variant={
            isMobileView
              ? ButtonVariant.SecondaryPurple
              : ButtonVariant.Secondary
          }
          shouldUseFullWidth
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} shouldUseFullWidth>
          Create Proposal
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
