import React, { ChangeEventHandler, FC, useState } from "react";
import classNames from "classnames";
import { RegularCheckboxIcon, SelectedCheckboxIcon } from "@/shared/icons";
import styles from "@/shared/ui-kit/TextEditor/components/Element/components/CheckboxItem/CheckboxItem.module.scss";
import { useChatMessageContext } from "../../context";

interface CheckboxItemProps {
  id: string;
  checked: boolean;
}

const CheckboxItem: FC<CheckboxItemProps> = (props) => {
  const { id, children } = props;
  const { isMessageLoading, isMessageEditAllowed, onCheckboxChange } =
    useChatMessageContext();
  const [checked, setChecked] = useState(props.checked);
  const isDisabled = isMessageLoading || !isMessageEditAllowed;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onCheckboxChange?.(id, !checked);
    setChecked((v) => !v);
  };

  return (
    <div className={classNames(styles.container)}>
      <div className={styles.inputWrapper} contentEditable={false}>
        <input
          className={styles.input}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={isDisabled}
        />
        <RegularCheckboxIcon
          className={classNames(styles.icon, styles.iconRegular, {
            [styles.iconDisabled]: isDisabled,
          })}
          color="currentColor"
        />
        <SelectedCheckboxIcon
          className={classNames(styles.icon, styles.iconSelected, {
            [styles.iconDisabled]: isDisabled,
          })}
          color="currentColor"
        />
      </div>
      <span className={styles.textWrapper}>{children}</span>
    </div>
  );
};

export default CheckboxItem;
