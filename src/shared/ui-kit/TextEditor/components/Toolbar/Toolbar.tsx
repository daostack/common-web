import React, { FC } from "react";
import { ElementType, FormatType } from "../../constants";
import { ElementButton } from "../ElementButton";
import { MarkButton } from "../MarkButton";
import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  disabled?: boolean;
}

const Toolbar: FC<ToolbarProps> = (props) => {
  const { disabled } = props;

  return (
    <div className={styles.container}>
      <MarkButton format={FormatType.Bold} disabled={disabled} />
      <ElementButton elementType={ElementType.Heading} disabled={disabled} />
      <ElementButton
        elementType={ElementType.BulletedList}
        disabled={disabled}
      />
      <ElementButton elementType={ElementType.Link} disabled={disabled} />
      <MarkButton format={FormatType.LTR} disabled={disabled} />
      <MarkButton format={FormatType.RTL} disabled={disabled} />
      <MarkButton format={FormatType.LeftIndent} disabled={disabled} />
      <MarkButton format={FormatType.RightIndent} disabled={disabled} />
      <div className={styles.bottomBorder} />
    </div>
  );
};

export default Toolbar;
