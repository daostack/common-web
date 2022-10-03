import React, { FC } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import LongLeftArrowIcon from "@/shared/icons/longLeftArrow.icon";
import "./index.scss";

interface GeneralInfoWrapperProps {
  description?: string;
  onGoBack?: (() => void) | null;
}

const GeneralInfoWrapper: FC<GeneralInfoWrapperProps> = (props) => {
  const { description, onGoBack, children } = props;

  return (
    <div className="supporters-page-general-info-wrapper">
      {onGoBack ? (
        <ButtonLink
          className="supporters-page-general-info-wrapper__back-button"
          onClick={onGoBack}
        >
          <LongLeftArrowIcon className="supporters-page-general-info-wrapper__back-icon" />
          Back
        </ButtonLink>
      ) : (
        <span className="supporters-page-general-info-wrapper__action">
          Join the
        </span>
      )}
      <h1
        className={classNames("supporters-page-general-info-wrapper__title", {
          "supporters-page-general-info-wrapper__bottom-margin": !description,
        })}
      >
        Dead Sea Guardians
      </h1>
      {description && (
        <p
          className={
            "supporters-page-general-info-wrapper__description supporters-page-general-info-wrapper__bottom-margin"
          }
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default GeneralInfoWrapper;
