import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlateStatic } from "slate-react";
import { Check3Icon } from "@/shared/icons";
import { CheckboxItemElement } from "../../../../types";
import { ElementAttributes } from "../../types";
import styles from "./CheckboxItem.module.scss";

interface CheckboxItemProps {
  attributes: ElementAttributes;
  element: CheckboxItemElement;
}

const CheckboxItem: FC<CheckboxItemProps> = (props) => {
  const { attributes, element, children } = props;
  const editor = useSlateStatic();
  const readOnly = useReadOnly();
  const { checked } = element;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const path = ReactEditor.findPath(editor, element);
    const newProperties: Partial<CheckboxItemElement> = {
      checked: event.target.checked,
    };
    Transforms.setNodes(editor, newProperties, { at: path });
  };

  return (
    <div
      {...attributes}
      className={classNames(styles.container, attributes.className)}
    >
      <div className={styles.inputWrapper} contentEditable={false}>
        <input
          className={styles.input}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
        />
        <span className={`${styles.circle} ${styles.circleInactive}`} />
        <span className={`${styles.circle} ${styles.circleActive}`}>
          <Check3Icon className={styles.checkIcon} />
        </span>
      </div>
      <span
        className={styles.textWrapper}
        contentEditable={!readOnly}
        suppressContentEditableWarning
      >
        {children}
      </span>
    </div>
  );
};

export default CheckboxItem;
