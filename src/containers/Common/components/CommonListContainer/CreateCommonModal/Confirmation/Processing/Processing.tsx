import React, { ReactElement, useEffect } from "react";
import { Loader } from "@/shared/components";
import "./index.scss";

interface ProcessingProps {
  setShouldShowCloseButton: (shouldShowCloseButton: boolean) => void;
}

export default function Processing({
  setShouldShowCloseButton,
}: ProcessingProps): ReactElement {
  useEffect(() => {
    setShouldShowCloseButton(false);
    return () => setShouldShowCloseButton(true);
  });

  return (
    <div className="create-common-processing">
      <img
        className="create-common-processing__image"
        alt="create-common-processing__image"
        src="/icons/discussions-empty.svg"
      />
      <h1 className="create-common-processing__title">Creating your Common</h1>
      <div className="create-common-processing__loader">
        <Loader />
      </div>
    </div>
  );
}
