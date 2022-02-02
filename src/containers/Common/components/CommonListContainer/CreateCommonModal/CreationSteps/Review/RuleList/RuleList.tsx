import React from "react";
import classNames from "classnames";
import { CommonRule } from "@/shared/models";
import "./index.scss";

interface RuleListProps {
  rules: CommonRule[];
  className?: string;
}

export default function RuleList({ rules, className }: RuleListProps) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <ul className={classNames("create-common-review-rule-list", className)}>
      {rules.map((rule, index) => (
        <li className="create-common-review-rule-list__item" key={index}>
          <span className="create-common-review-rule-list__number">
            Rule #{index + 1}
          </span>
          <h5 className="create-common-review-rule-list__title">
            {rule.title}
          </h5>
          <p className="create-common-review-rule-list__description">
            {rule.value}
          </p>
        </li>
      ))}
    </ul>
  );
}
