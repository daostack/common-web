import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { isRTL } from "@/shared/utils";
import { SurveyData } from "../types";
import "./index.scss";

interface ConfirmationProps {
  surveyData: SurveyData;
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { surveyData, onSubmit, onCancel } = props;
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const toggleDescription = () => {
    setIsDescriptionExpanded((isExpanded) => !isExpanded);
  };

  return (
    <div className="survey-confirmation">
      <img
        className="survey-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="survey-confirmation__title">Survey</h4>
      <p className="survey-confirmation__circle-name">{surveyData.title}</p>
      <p
        className={classNames("survey-confirmation__circle-name", {
          "survey-confirmation__circle-name__expanded": !isDescriptionExpanded,
          "survey-confirmation__circle-name--rtl": isRTL(
            surveyData.description,
          ),
        })}
      >
        {surveyData.description}
      </p>
      <a className="survey-confirmation__see-more" onClick={toggleDescription}>
        See {isDescriptionExpanded ? "less <" : "more >"}
      </a>
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
