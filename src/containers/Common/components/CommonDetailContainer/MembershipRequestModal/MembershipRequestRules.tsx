import React, { useEffect } from "react";
import { Button } from "../../../../../shared/components";
import { IStageProps } from "./MembershipRequestModal"
import firebase from "firebase/app";
import "./index.scss";
import { Common } from "@/shared/models";
import { Governance } from "@/containers/Common/interfaces/Governanve";

// TODO: need to put in a seperate file
const getRules = async (common: Common) => {
  if (common.governanceId) {
    const governance = (await firebase.firestore().collection("governance").doc(common.governanceId).get()).data() as Governance;
    return Object.entries(governance.unstructuredRules);
  }
}

export default function MembershipRequestRules(props: IStageProps) {
  const { userData, setUserData, common } = props;

  return (
    <div className="membership-request-content membership-request-rules">
      <div className="sub-title">Accept Common Rules</div>
      <div className="sub-text">
        If the Common approves your request you will <br /> become a member with
        equal voting rights
      </div>
      <ol className="membership-request-rules__rules-wrapper">
        {common?.rules.map((rule, index) => (
          <li
            key={index}
            className="membership-request-rules__rules-item-wrapper"
          >
            <div className="membership-request-rules__rules-item">
              <h4 className="membership-request-rules__rules-item-title">
                {rule.title}
              </h4>
              <p className="membership-request-rules__rules-item-description">
                {rule.value}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <Button
        onClick={() => setUserData({ ...userData, stage: 3 })}
        className="membership-request-rules__submit-button"
      >
        Accept Rules
      </Button>
    </div>
  );
}
