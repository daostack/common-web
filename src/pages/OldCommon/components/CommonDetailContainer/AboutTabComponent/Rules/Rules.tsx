import React, { FC, useMemo, useState } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import { UnstructuredRules } from "@/shared/models";
import { commonTypeText, isRTL } from "@/shared/utils";
import "./index.scss";

interface CommonRulesProps {
  rules: UnstructuredRules;
  isSubCommon: boolean;
}

const DEFAULT_RULES_TO_DISPLAY_AMOUNT = 2;

const CommonRules: FC<CommonRulesProps> = (props) => {
  const { rules, isSubCommon } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const currentRules = useMemo(
    () =>
      isExpanded ? rules : rules.slice(0, DEFAULT_RULES_TO_DISPLAY_AMOUNT),
    [rules, isExpanded],
  );
  const shouldShowToggleButton = rules.length > DEFAULT_RULES_TO_DISPLAY_AMOUNT;

  if (currentRules.length === 0) {
    return null;
  }

  const toggleRules = () => {
    setIsExpanded((value) => !value);
  };

  return (
    <div className="about-tab-common-rules">
      <h2 className="about-tab-common-rules__title">
        {commonTypeText(isSubCommon)} rules
      </h2>
      <ul className="about-tab-common-rules__list">
        {currentRules.map((rule, index) => (
          <li
            key={index}
            className={classNames("about-tab-common-rules__list-item", {
              "about-tab-common-rules__list-item--rtl":
                isRTL(rule.title) || isRTL(rule.definition),
            })}
          >
            <h3 className="about-tab-common-rules__list-item-title">
              {rule.title}
            </h3>
            <p className="about-tab-common-rules__list-item-description">
              {rule.definition}
            </p>
          </li>
        ))}
      </ul>
      {shouldShowToggleButton && (
        <ButtonLink
          className="about-tab-common-rules__see-more-button"
          onClick={toggleRules}
        >
          See {isExpanded ? "less <" : "more >"}
        </ButtonLink>
      )}
    </div>
  );
};

export default CommonRules;
