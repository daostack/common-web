import React from "react";
import classNames from "classnames";
import { Rules } from "@/shared/models";
import "./index.scss";

interface RuleListProps {
  rules: Rules[];
  className?: string;
}

export default function RuleList({ rules, className }: RuleListProps) {
  return (
    <ul className={classNames("review-rule-list", className)}>
      {rules.map((rule, index) => (
        <li className="review-rule-list__item" key={index}>
          <span className="review-rule-list__number">Rule #{index + 1}</span>
          <h5 className="review-rule-list__title">{rule.title}</h5>
          <p className="review-rule-list__description">{rule.value}</p>
        </li>
      ))}
    </ul>
  );
}
