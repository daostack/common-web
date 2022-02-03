import React, { useCallback, useMemo, useState, ReactElement } from "react";

import { isMobile } from "@/shared/utils";
import { ButtonLink, Separator } from "@/shared/components";
import { Checkbox } from "@/shared/components/Form";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import ExplanationIcon from "@/shared/icons/explanation.icon";
import { Progress } from "../Progress";
import { CheckedList } from "./CheckedList";
import "./index.scss";

interface UserAcknowledgmentProps {
  currentStep: number;
  onFinish: () => void;
}

const CAUSES_TEXT = "Education, Religion, Culture, Science, Health, Welfare, Sports, Fighting corruption, Protecting democracy, Employment, and Human rights.";

export default function UserAcknowledgment({ currentStep, onFinish }: UserAcknowledgmentProps): ReactElement {
  const [showCausesBox, setShowCausesBox] = useState(false);
  const [areTermsConfirmed, setAreTermsConfirmed] = useState(false);
  const isMobileView = isMobile();

  const toggleCausesBoxShowing = useCallback(() => {
    setShowCausesBox(shouldShow => !shouldShow);
  }, []);

  const handleTermsChange = useCallback(() => {
    setAreTermsConfirmed(checked => !checked);
  }, []);

  const listItems = useMemo(() => [
    "The purpose of the Common is not in violation of any law, regulation, or 3rd party rights.",
    <>The Common will be raising funds for <strong>non-profit or charitable causes only.</strong> The common is not intended for commercial or for-profit purposes.</>,
    "All Commons and their members must comply with applicable financial and tax obligations.",
    <>
      The Common will solely promote one or more of the following <ButtonLink className="create-common-user-acknowledgment__causes-link" onClick={toggleCausesBoxShowing}>Causes<ExplanationIcon className="create-common-user-acknowledgment__causes-icon" /></ButtonLink>.
    </>,
  ], [toggleCausesBoxShowing]);

  const headerEl = useMemo(() => (
    <>
      <img
        className="create-common-user-acknowledgment__header-image"
        src="/assets/images/common-creation-user-acknowledgment.svg"
        alt="User Acknowledgment"
      />
      <Progress creationStep={currentStep} />
    </>
  ), [currentStep]);

  return (
    <>
      {!isMobileView && (
        <ModalHeaderContent>
          {headerEl}
        </ModalHeaderContent>
      )}
      <div className="create-common-user-acknowledgment">
        {isMobileView && headerEl}
        <Separator className="create-common-user-acknowledgment__separator" />
        <CheckedList
          className="create-common-user-acknowledgment__checked-list"
          items={listItems}
        />
        {showCausesBox && (
          <div className="create-common-user-acknowledgment__causes-box">
            {CAUSES_TEXT}
          </div>
        )}
        <span className="create-common-user-acknowledgment__terms-text">
          For more details and information refer to the <ButtonLink className="create-common-user-acknowledgment__terms-link">Terms of Use.</ButtonLink>
        </span>
        <Checkbox
          className="create-common-user-acknowledgment__terms-checkbox"
          id="termsAgreement"
          name="termsAgreement"
          label="I agree with the above statement."
          checked={areTermsConfirmed}
          onChange={handleTermsChange}
          styles={{
            label: "create-common-user-acknowledgment__terms-checkbox-label",
          }}
        />
        <ModalFooter sticky={!isMobileView}>
          <div className="create-common-user-acknowledgment__modal-footer">
            <button
              key="user-acknowledgement-continue"
              className="button-blue"
              onClick={onFinish}
              disabled={!areTermsConfirmed}
            >
              Continue to Funding
            </button>
          </div>
        </ModalFooter>
      </div>
    </>
  );
}
