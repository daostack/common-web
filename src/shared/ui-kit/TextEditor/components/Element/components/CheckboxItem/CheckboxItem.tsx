import React, { FC } from "react";
import classNames from "classnames";
import { Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlateStatic } from "slate-react";
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

  return (
    <div
      {...attributes}
      className={classNames(styles.container, attributes.className)}
    >
      <span contentEditable={false} className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => {
            const path = ReactEditor.findPath(editor, element);
            const newProperties: Partial<CheckboxItemElement> = {
              checked: event.target.checked,
            };
            Transforms.setNodes(editor, newProperties, { at: path });
          }}
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={classNames(styles.checkboxText, {
          [styles.checkboxTextChecked]: checked,
        })}
      >
        {children}
      </span>
    </div>
  );
};

export default CheckboxItem;
