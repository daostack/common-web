import React, { FC } from "react";
import { Button } from "@/shared/components";
import "./index.scss";

interface DeleteCommonRequestProps {
  onOkClick: () => void;
  isSubCommon: boolean;
}

const DeleteCommonRequest: FC<DeleteCommonRequestProps> = (props) => {
  const { onOkClick, isSubCommon } = props;
  const commonWord = isSubCommon ? "space" : "common";

  return (
    <div className="delete-common-request">
      <p className="delete-common-request__text">
        It turns out that you are the only member in this {commonWord}. A{" "}
        {commonWord} cannot be left empty, so you will have to close it. Please
        use the "Delete {commonWord.toUpperCase()}" action.
      </p>
      <Button
        className="delete-common-request__button"
        onClick={onOkClick}
        shouldUseFullWidth
      >
        Got it
      </Button>
    </div>
  );
};

export default DeleteCommonRequest;
