import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import {
  Separator
} from "@/shared/components";
import "./index.scss";


interface StageNameProps {
  className?: string;
  name: string;
  icon: ReactNode;
  backgroundColor?: "light-pink" | "light-yellow";
  withSeparator?: boolean;
}

const StageName: FC<StageNameProps> = (props) => {
  const { name, icon, backgroundColor = "light-pink", withSeparator = true } = props;
  const className = classNames("create-proposal-stage-name", props.className, {
    "create-proposal-stage-name--light-pink": backgroundColor === "light-pink",
    "create-proposal-stage-name--light-yellow": backgroundColor === "light-yellow",
  });

  return (
    <>
        <div className={className}>
          {icon}
          <span className="create-proposal-stage-name__text">{name}</span>
        </div>
        {withSeparator && <Separator className="create-proposal-stage-name__separator" />}
    </>
  );
};

export default StageName;
