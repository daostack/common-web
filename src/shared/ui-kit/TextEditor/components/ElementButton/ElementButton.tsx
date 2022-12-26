import React, { FC, MouseEventHandler, ReactNode } from "react";
import { useSlate } from "slate-react";
import { ListMarkIcon } from "@/shared/icons";
import { ElementType } from "../../constants";
import { isElementActive, toggleElement } from "../../utils";
import { ToolbarButton } from "../ToolbarButton";
import styles from "./ElementButton.module.scss";

interface ElementButtonProps {
  elementType: ElementType;
}

const getIconByFormat = (elementType: ElementType): ReactNode => {
  if (elementType === ElementType.BulletedList) {
    return <ListMarkIcon className={styles.listMarkIcon} />;
  }

  return null;
};

const ElementButton: FC<ElementButtonProps> = (props) => {
  const { elementType } = props;
  const editor = useSlate();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    toggleElement(editor, elementType);
  };

  return (
    <ToolbarButton
      active={isElementActive(editor, elementType)}
      onClick={handleClick}
    >
      {getIconByFormat(elementType)}
    </ToolbarButton>
  );
};

export default ElementButton;
