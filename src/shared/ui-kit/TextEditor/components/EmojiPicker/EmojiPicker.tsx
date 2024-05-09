import React, { FC, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import data, { Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ButtonIcon } from "@/shared/components";
import { Theme } from "@/shared/constants";
import { useOutsideClick } from "@/shared/hooks";
import { EmojiIcon } from "@/shared/icons";
import { selectTheme } from "@/shared/store/selectors";
import styles from "./EmojiPicker.module.scss";

export interface EmojiPickerProps {
  containerClassName?: string;
  pickerContainerClassName?: string;
  onEmojiSelect: (emoji: Skin) => void;
  isMessageSent?: boolean;
  onToggleIsMessageSent?: () => void;
}

const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const {
    containerClassName,
    pickerContainerClassName,
    onEmojiSelect,
    isMessageSent,
    onToggleIsMessageSent,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { isOutside, setOutsideValue } = useOutsideClick(wrapperRef);
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (isOutside) {
      setIsOpen(false);
      setOutsideValue();
    }
  }, [isOutside, setOutsideValue]);

  useEffect(() => {
    if (isMessageSent) {
      onToggleIsMessageSent && onToggleIsMessageSent();
      setIsOpen(false);
    }
  }, [isMessageSent, onToggleIsMessageSent]);

  const handleOpenPicker = () => {
    setIsOpen((value) => !value);
  };

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.container, containerClassName)}
    >
      <ButtonIcon onClick={handleOpenPicker}>
        <EmojiIcon />
      </ButtonIcon>

      {isOpen && (
        <div
          className={classNames(
            pickerContainerClassName || styles.pickerContainer,
          )}
        >
          <Picker
            data={data}
            onEmojiSelect={onEmojiSelect}
            theme={theme === Theme.Dark ? Theme.Dark : Theme.Light}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
