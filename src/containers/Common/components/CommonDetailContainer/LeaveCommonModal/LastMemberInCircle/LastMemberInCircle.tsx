import React, { FC } from "react";
import { Button } from "@/shared/components";
import "./index.scss";

interface LastMemberInCircleProps {
  onOkClick: () => void;
}

const LastMemberInCircle: FC<LastMemberInCircleProps> = (props) => {
  const { onOkClick } = props;

  return (
    <div className="last-member-in-circle-step">
      <p className="last-member-in-circle-step__text">
        You are the only member in this common with permission to some essential
        actions defined in your circle. Please assign another member to this
        circle in order to leave it.
      </p>
      <Button
        className="last-member-in-circle-step__button"
        onClick={onOkClick}
        shouldUseFullWidth
      >
        Got it
      </Button>
    </div>
  );
};

export default LastMemberInCircle;
