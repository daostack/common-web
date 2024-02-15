import React, { ChangeEventHandler, FC, useEffect, useState } from "react";
import classNames from "classnames";
import { Check3Icon } from "@/shared/icons";
import textEditorStyles from "@/shared/ui-kit/TextEditor/components/Element/components/CheckboxItem/CheckboxItem.module.scss";
import { useChatMessageContext } from "../../context";
import styles from "./CheckboxItem.module.scss";

interface CheckboxItemProps {
  id: string;
  checked: boolean;
  isRTL: boolean;
}

const CheckboxItem: FC<CheckboxItemProps> = (props) => {
  const { id, isRTL, children } = props;
  const { isMessageLoading, isMessageEditAllowed, onCheckboxChange } =
    useChatMessageContext();
  const [checked, setChecked] = useState(props.checked);
  const isDisabled = isMessageLoading || !isMessageEditAllowed;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onCheckboxChange?.(id, !checked);
    setChecked((v) => !v);
  };

  useEffect(() => {
    setChecked(props.checked);
  }, [props.checked]);

  return (
    <div
      className={classNames(textEditorStyles.container, {
        [textEditorStyles.containerRTL]: isRTL,
      })}
    >
      <div
        className={classNames(textEditorStyles.inputWrapper, {
          [textEditorStyles.inputWrapperRTL]: isRTL,
        })}
        contentEditable={false}
      >
        <input
          className={textEditorStyles.input}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={isDisabled}
        />
        <span
          className={classNames(
            textEditorStyles.circle,
            styles.circleInactive,
            {
              [textEditorStyles.circleDisabled]: isDisabled,
            },
          )}
        />
        <span
          className={classNames(
            textEditorStyles.circle,
            textEditorStyles.circleActive,
            {
              [textEditorStyles.circleDisabled]: isDisabled,
            },
          )}
        >
          <Check3Icon className={textEditorStyles.checkIcon} />
        </span>
      </div>
      <span className={textEditorStyles.textWrapper}>{children}</span>
    </div>
  );
};

export default CheckboxItem;
