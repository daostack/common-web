import React from "react";
import { RulesArrayItem } from "@/shared/components/Form/Formik";
import "./index.scss";

interface RuleListProps {
  rules: RulesArrayItem[];
}

export default function RuleList({ rules }: RuleListProps) {
  return (
    <ul className="review-rule-list">
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
