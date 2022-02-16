import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

const Error: FC = () => (
  <div className="create-common-confirmation-error">
    <img
      className="create-common-confirmation-error__image"
      src="/icons/add-proposal/illustrations-medium-alert.svg"
      alt="Something went wrong"
    />
    <h2 className="create-common-confirmation-error__title">
      Something went wrong
    </h2>
    <p className="create-common-confirmation-error__sub-title">
      This took longer than expected, please try again later
    </p>
    <Button
      key="personal-contribution-continue"
      className="create-common-confirmation-error__submit-button"
      variant={ButtonVariant.Secondary}
      shouldUseFullWidth
    >
      OK
    </Button>
    <span className="create-common-confirmation-error__view-details">
      View error details
    </span>
  </div>
);

export default Error;
