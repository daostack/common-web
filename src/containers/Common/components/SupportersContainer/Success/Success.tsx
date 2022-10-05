import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { Button, ButtonVariant } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import "./index.scss";

const Success: FC = () => {
  const history = useHistory();
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
  const { supportersData } = useSupportersDataContext();

  const handleJumpIn = () => {
    if (supportersData) {
      history.push(
        ROUTE_PATHS.COMMON_DETAIL.replace(":id", supportersData.commonId)
      );
    }
  };

  return (
    <div className="supporters-page-success">
      <h1 className="supporters-page-success__title">{t("success.title")}</h1>
      <p className="supporters-page-success__description">
        You’re now a Dead-Sea Guardian
      </p>
      <div className="supporters-page-success__info-block">
        <h2 className="supporters-page-success__info-block-title">
          {t("success.infoBlockTitle")}
        </h2>
        <p className="supporters-page-success__info-block-content">
          The Dead-Sea Guardians is a community movement managed via Common.
          Common members discuss and vote on decisions and expenses. For more
          details on how to be active in the community. Check out the
          Dead-Sea-Guardians common for more details on how to be active in the
          community.
        </p>
      </div>
      <div className="supporters-page-success__buttons-wrapper">
        <Button
          className="supporters-page-success__submit-button"
          onClick={handleJumpIn}
          variant={ButtonVariant.SecondaryPurple}
          shouldUseFullWidth
        >
          {t("buttons.enterTheCommon")}
        </Button>
        <Button
          className="supporters-page-success__submit-button"
          onClick={handleJumpIn}
          shouldUseFullWidth
        >
          {t("buttons.shareWithFriends")}
        </Button>
      </div>
    </div>
  );
};

export default Success;
