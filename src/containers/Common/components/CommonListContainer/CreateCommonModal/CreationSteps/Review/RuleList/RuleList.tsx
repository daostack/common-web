import React from "react";

import { RulesArrayItem } from "@/shared/components/Form/Formik";
import classNames from "classnames";
import "./index.scss";

interface RuleListProps {
  rules: RulesArrayItem[];
  className?: string;
}

export default function RuleList({ rules, className }: RuleListProps) {
  return (
    <ul className={classNames("review-rule-list", className)}>
      {rules.map((rule, index) => (
        <li className="review-rule-list__item" key={index}>
          <span className="review-rule-list__number">Rule #{index + 1}</span>
          <h5 className="review-rule-list__title">{rule.title}</h5>
          <p className="review-rule-list__description">{rule.description}</p>
        </li>
      ))}
    </ul>
  );
}
