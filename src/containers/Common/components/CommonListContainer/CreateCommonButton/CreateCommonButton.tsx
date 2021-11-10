import React from "react";

import { isMobile } from "../../../../../shared/utils";
import CloseIcon from "../../../../../shared/icons/close.icon";
import "./index.scss";

const BUTTON_TEXT = 'Create Common';

export default function CreateCommonButton() {
  const isMobileView = isMobile();

  return (
    <button className="create-common-button button-blue" aria-label={isMobileView ? BUTTON_TEXT : undefined}>
      <CloseIcon
        width={24}
        height={24}
        fill="currentColor"
      />
      <span className="create-common-button-text">
        {BUTTON_TEXT}
      </span>
    </button>
  );
}
