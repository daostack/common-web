import React, { FC, useMemo } from "react";
import { UnstructuredRules } from "@/shared/models";
import "./index.scss";

interface CommonRulesProps {
  rules: UnstructuredRules;
}

const CommonRules: FC<CommonRulesProps> = (props) => {
  const { rules } = props;
  const currentRules = useMemo(() => rules.slice(0, 2), [rules]);

  if (currentRules.length === 0) {
    return null;
  }

  return (
    <div className="about-tab-common-rules">
      <ul className="about-tab-common-rules__list">
        {currentRules.map((rule, index) => (
          <li key={index} className="about-tab-common-rules__list-item">
            <h3 className="about-tab-common-rules__list-item-title">
              {rule.title}
            </h3>
            <p className="about-tab-common-rules__list-item-description">
              {rule.definition}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommonRules;
