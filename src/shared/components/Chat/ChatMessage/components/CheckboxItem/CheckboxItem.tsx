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
  const { isMessageLoading, onCheckboxChange } = useChatMessageContext();
  const [checked, setChecked] = useState(props.checked);

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
          disabled={isMessageLoading}
        />
        <RegularCheckboxIcon
          className={classNames(styles.icon, styles.iconRegular, {
            [styles.iconDisabled]: isMessageLoading,
          })}
          color="currentColor"
        />
        <SelectedCheckboxIcon
          className={classNames(styles.icon, styles.iconSelected, {
            [styles.iconDisabled]: isMessageLoading,
          })}
          color="currentColor"
        />
      </div>
      <span className={styles.textWrapper}>{children}</span>
    </div>
  );
};

export default CheckboxItem;
