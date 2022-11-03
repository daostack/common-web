import React from "react";
import classNames from "classnames";
import { BaseRule } from "@/shared/models";
import "./index.scss";

interface RuleListProps {
  rules: BaseRule[];
  className?: string;
}

export default function RuleList({ rules, className }: RuleListProps) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <ul className={classNames("update-rules-review-rule-list", className)}>
      {rules.map((rule, index) => (
        <li className="update-rules-review-rule-list__item" key={index}>
          <span className="update-rules-review-rule-list__number">
            Rule #{index + 1}
          </span>
          <h5 className="update-rules-review-rule-list__title">{rule.title}</h5>
          <p className="update-rules-review-rule-list__description">
            {rule.definition}
          </p>
        </li>
      ))}
    </ul>
  );
}
