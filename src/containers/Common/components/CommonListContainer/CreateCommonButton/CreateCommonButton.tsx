import React from "react";

import { isMobile } from "../../../../../shared/utils";
import AddIcon from "../../../../../shared/icons/add.icon";
import "./index.scss";

const BUTTON_TEXT = 'Create Common';

interface CreateCommonButtonProps {
  onClick: () => void;
}

export default function CreateCommonButton({ onClick }: CreateCommonButtonProps) {
  const isMobileView = isMobile();

  return (
    <button
      className="create-common-button button-blue"
      onClick={onClick}
      aria-label={isMobileView ? BUTTON_TEXT : undefined}
    >
      <AddIcon className="create-common-button-icon" />
      <span className="create-common-button-text">
        {BUTTON_TEXT}
      </span>
    </button>
  );
}
