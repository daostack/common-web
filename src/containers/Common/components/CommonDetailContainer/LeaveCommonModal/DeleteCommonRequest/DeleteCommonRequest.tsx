import React, { FC } from "react";
import { Button } from "@/shared/components";
import "./index.scss";

interface DeleteCommonRequestProps {
  onOkClick: () => void;
}

const DeleteCommonRequest: FC<DeleteCommonRequestProps> = (props) => {
  const { onOkClick } = props;

  return (
    <div className="delete-common-request">
      <p className="delete-common-request__text">
        It turns out that you are the only member in this common. A common
        cannot be left empty, so you will have to close it. Please use the
        "Delete Common" action.
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
