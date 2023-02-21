import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSupportersDataContext } from "@/pages/OldCommon/containers/SupportersContainer/context";
import { Button, ButtonVariant, SupportShare } from "@/shared/components";
import {
  Colors,
  ScreenSize,
  SharePopupVariant,
  ShareViewType,
} from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import "./index.scss";

interface SuccessProps {
  common: Common;
  isOldCommonMember: boolean;
  onFinish: () => void;
}

const Success: FC<SuccessProps> = (props) => {
  const { common, isOldCommonMember, onFinish } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
  const { currentTranslation } = useSupportersDataContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const successPageDescription =
    (isOldCommonMember &&
      currentTranslation?.successPageDescriptionForOldMembers) ||
    currentTranslation?.successPageDescription;
  const successPageInfoBlockDescription =
    (isOldCommonMember &&
      currentTranslation?.successPageInfoBlockDescriptionForOldMembers) ||
    currentTranslation?.successPageInfoBlockDescription;

  return (
    <div className="supporters-page-success">
      <h1 className="supporters-page-success__title">{t("success.title")}</h1>
      <p className="supporters-page-success__description">
        {successPageDescription}
      </p>
      <div className="supporters-page-success__info-block">
        <h2 className="supporters-page-success__info-block-title">
          {t("success.infoBlockTitle")}
        </h2>
        <p className="supporters-page-success__info-block-content">
          {successPageInfoBlockDescription}
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
        <SupportShare
          className="supporters-page-success__submit-button"
          common={common}
          type={
            isMobileView
              ? ShareViewType.ModalMobile
              : ShareViewType.ModalDesktop
          }
          color={Colors.lightPurple}
          top=""
          popupVariant={SharePopupVariant.TopCenter}
        >
          <Button shouldUseFullWidth>{t("buttons.shareWithFriends")}</Button>
        </SupportShare>
      </div>
    </div>
  );
};

export default Success;
