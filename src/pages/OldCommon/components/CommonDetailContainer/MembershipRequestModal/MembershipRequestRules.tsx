import React from "react";
import { Button } from "@/shared/components";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";
import { shouldShowPaymentStep } from "./helpers";
import "./index.scss";

export default function MembershipRequestRules(props: IStageProps) {
  const { userData, setUserData, governance, isAutomaticAcceptance } = props;
  const rules = governance.unstructuredRules || [];

  return (
    <div className="membership-request-content membership-request-rules">
      <div className="sub-title">Accept Common Rules</div>
      <div className="sub-text">
        {!isAutomaticAcceptance && (
          <>
            If the Common approves your request you will <br /> become a member
            with equal voting rights
          </>
        )}
      </div>
      <ol className="membership-request-rules__rules-wrapper">
        {rules.map((rule, index) => (
          <li
            key={index}
            className="membership-request-rules__rules-item-wrapper"
          >
            <div className="membership-request-rules__rules-item">
              <h4 className="membership-request-rules__rules-item-title">
                {rule.title}
              </h4>
              <p className="membership-request-rules__rules-item-description">
                {rule.definition}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <Button
        onClick={() =>
          setUserData({
            ...userData,
            stage: shouldShowPaymentStep(governance)
              ? MembershipRequestStage.Payment
              : MembershipRequestStage.Creating,
          })
        }
        className="membership-request-rules__submit-button"
      >
        Accept Rules
      </Button>
    </div>
  );
}
