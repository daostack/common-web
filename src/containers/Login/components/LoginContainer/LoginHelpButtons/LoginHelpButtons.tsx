import React from "react";
import { useTranslation } from "react-i18next";
import RightArrowIcon from "../../../../../shared/icons/rightArrow.icon";
import "./index.scss";

interface LinkItem {
  text: string;
  link: string;
}

const LoginHelpButtons = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "login",
  });
  const items: LinkItem[] = [
    {
      text: t("termsOfUse"),
      link: require("../../../../../shared/assets/terms_and_conditions.pdf"),
    },
    {
      text: t("privacyPolicy"),
      link: require("../../../../../shared/assets/privacy_policy.pdf"),
    },
  ];

  return (
    <ul className="login-help-buttons">
      {items.map((item, index) => (
        <li key={index} className="login-help-buttons__item">
          <a
            className="login-help-buttons__link"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{item.text}</span>
            <RightArrowIcon className="login-help-buttons__arrow-icon" />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default LoginHelpButtons;
