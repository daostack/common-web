import React from "react";

import { isMobile } from "../../../../../shared/utils";
import AddIcon from "../../../../../shared/icons/add.icon";
import "./index.scss";

const BUTTON_TEXT = 'Create Common';

export default function CreateCommonButton() {
  const isMobileView = isMobile();

  return (
    <button className="create-common-button button-blue" aria-label={isMobileView ? BUTTON_TEXT : undefined}>
      <AddIcon className="create-common-button-icon" />
      <span className="create-common-button-text">
        {BUTTON_TEXT}
      </span>
    </button>
  );
}
