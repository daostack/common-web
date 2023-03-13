import React, { FC } from "react";
import { Button } from "@/shared/components";
import "./index.scss";

interface LastMemberInCircleProps {
  onOkClick: () => void;
  isSubCommon: boolean;
}

const LastMemberInCircle: FC<LastMemberInCircleProps> = (props) => {
  const { onOkClick, isSubCommon } = props;
  const commonWord = isSubCommon ? "Project" : "Common";

  return (
    <div className="last-member-in-circle-step">
      <p className="last-member-in-circle-step__text">
        You are the only member in this {commonWord} with permission to some
        essential actions defined in your circle. Please assign another member
        to this circle in order to leave it.
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
