import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface SuccessProps {
  onFinish: () => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { onFinish } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
  const { currentTranslation } = useSupportersDataContext();

  return (
    <div className="supporters-page-success">
      <h1 className="supporters-page-success__title">{t("success.title")}</h1>
      <p className="supporters-page-success__description">
        {currentTranslation?.successPageDescription}
      </p>
      <div className="supporters-page-success__info-block">
        <h2 className="supporters-page-success__info-block-title">
          {t("success.infoBlockTitle")}
        </h2>
        <p className="supporters-page-success__info-block-content">
          {currentTranslation?.successPageInfoBlockDescription}
        </p>
      </div>
      <div className="supporters-page-success__buttons-wrapper">
        <Button
          className="supporters-page-success__submit-button"
          onClick={onFinish}
          variant={ButtonVariant.SecondaryPurple}
          shouldUseFullWidth
        >
          {t("buttons.enterTheCommon")}
        </Button>
        <Button
          className="supporters-page-success__submit-button"
          onClick={onFinish}
          shouldUseFullWidth
        >
          {t("buttons.shareWithFriends")}
        </Button>
      </div>
    </div>
  );
};

export default Success;
