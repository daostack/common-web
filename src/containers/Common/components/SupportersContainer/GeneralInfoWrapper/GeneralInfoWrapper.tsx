import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import LongLeftArrowIcon from "@/shared/icons/longLeftArrow.icon";
import "./index.scss";

interface GeneralInfoWrapperProps {
  title: string;
  description?: string;
  onGoBack?: (() => void) | null;
}

const GeneralInfoWrapper: FC<GeneralInfoWrapperProps> = (props) => {
  const { title, description, onGoBack, children } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });

  return (
    <div className="supporters-page-general-info-wrapper">
      {onGoBack ? (
        <ButtonLink
          className="supporters-page-general-info-wrapper__back-button"
          onClick={onGoBack}
        >
          <LongLeftArrowIcon className="supporters-page-general-info-wrapper__back-icon" />
          {t("buttons.back")}
        </ButtonLink>
      ) : (
        <span className="supporters-page-general-info-wrapper__action">
          {t("joinText")}
        </span>
      )}
      <h1
        className={classNames("supporters-page-general-info-wrapper__title", {
          "supporters-page-general-info-wrapper__bottom-margin": !description,
        })}
      >
        {title}
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
