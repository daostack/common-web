import React, { FC, MouseEventHandler, ReactNode } from "react";
import { useSlate } from "slate-react";
import { BoldMarkIcon } from "@/shared/icons";
import { FormatType } from "../../constants";
import { isMarkActive, toggleMark } from "../../utils";
import { ToolbarButton } from "../ToolbarButton";
import styles from "./MarkButton.module.scss";

interface MarkButtonProps {
  format: FormatType;
}

const getIconByFormat = (format: FormatType): ReactNode => {
  if (format === FormatType.Bold) {
    return <BoldMarkIcon className={styles.boldIcon} />;
  }

  return null;
};

const MarkButton: FC<MarkButtonProps> = (props) => {
  const { format } = props;
  const editor = useSlate();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    toggleMark(editor, format);
  };

  return (
    <ToolbarButton active={isMarkActive(editor, format)} onClick={handleClick}>
      {getIconByFormat(format)}
    </ToolbarButton>
  );
};

export default MarkButton;
