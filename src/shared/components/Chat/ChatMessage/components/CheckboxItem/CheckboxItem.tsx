import React, { ChangeEventHandler, FC, useState } from "react";
import classNames from "classnames";
import { RegularCheckboxIcon, SelectedCheckboxIcon } from "@/shared/icons";
import styles from "@/shared/ui-kit/TextEditor/components/Element/components/CheckboxItem/CheckboxItem.module.scss";

interface CheckboxItemProps {
  checked: boolean;
}

const CheckboxItem: FC<CheckboxItemProps> = (props) => {
  const { children } = props;
  const [checked, setChecked] = useState(props.checked);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
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
        />
        <RegularCheckboxIcon
          className={`${styles.icon} ${styles.iconRegular}`}
        />
        <SelectedCheckboxIcon
          className={`${styles.icon} ${styles.iconSelected}`}
          color="currentColor"
        />
      </div>
      <span className={styles.textWrapper}>{children}</span>
    </div>
  );
};

export default CheckboxItem;
