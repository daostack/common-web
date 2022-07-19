import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import "./index.scss";

interface StageNameProps {
  className?: string;
  name: string;
  icon: ReactNode;
  backgroundColor?: "light-pink" | "light-yellow";
}

const StageName: FC<StageNameProps> = (props) => {
  const { name, icon, backgroundColor = "light-pink" } = props;
  const className = classNames("create-proposal-stage-name", props.className, {
    "create-proposal-stage-name--light-pink": backgroundColor === "light-pink",
    "create-proposal-stage-name--light-yellow": backgroundColor === "light-yellow",
  });

  return (
    <div className={className}>
      {icon}
      <span className="create-proposal-stage-name__text">{name}</span>
    </div>
  );
};

export default StageName;
