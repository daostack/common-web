import React, { FC } from "react";
import { ButtonLink } from "@/shared/components";
import LongLeftArrowIcon from "@/shared/icons/longLeftArrow.icon";
import "./index.scss";

interface GeneralInfoWrapperProps {
  onGoBack?: (() => void) | null;
}

const GeneralInfoWrapper: FC<GeneralInfoWrapperProps> = (props) => {
  const { onGoBack, children } = props;

  return (
    <div className="dead-sea-general-info-wrapper">
      {onGoBack ? (
        <ButtonLink
          className="dead-sea-general-info-wrapper__back-button"
          onClick={onGoBack}
        >
          <LongLeftArrowIcon className="dead-sea-general-info-wrapper__back-icon" />
          Back
        </ButtonLink>
      ) : (
        <span className="dead-sea-general-info-wrapper__action">Join the</span>
      )}
      <h1 className="dead-sea-general-info-wrapper__title">
        Dead Sea Guardians
      </h1>
      {children}
    </div>
  );
};

export default GeneralInfoWrapper;
