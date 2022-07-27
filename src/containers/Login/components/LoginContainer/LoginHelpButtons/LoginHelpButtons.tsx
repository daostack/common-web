import React from "react";
import RightArrowIcon from "../../../../../shared/icons/rightArrow.icon";
import "./index.scss";

interface LinkItem {
  text: string;
  link: string;
}

const ITEMS: LinkItem[] = [
  {
    text: "Terms of use",
    link: require("../../../../../shared/assets/terms_and_conditions.pdf"),
  },
  {
    text: "Privacy policy",
    link: require("../../../../../shared/assets/privacy_policy.pdf"),
  },
];

const LoginHelpButtons = () => {
  return (
    <ul className="login-help-buttons">
      {ITEMS.map((item, index) => (
        <li key={index} className="login-help-buttons__item">
          <a
            className="login-help-buttons__link"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{item.text}</span>
            <RightArrowIcon />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default LoginHelpButtons;
