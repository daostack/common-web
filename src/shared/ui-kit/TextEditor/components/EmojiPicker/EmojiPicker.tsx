import React, { FC, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import data, { Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ButtonIcon } from "@/shared/components";
import { useOutsideClick } from "@/shared/hooks";
import { EmojiIcon } from "@/shared/icons";
import styles from "./EmojiPicker.module.scss";

export interface EmojiPickerProps {
  containerClassName?: string;
  pickerContainerClassName?: string;
  onEmojiSelect: (emoji: Skin) => void;
  isMessageSent?: boolean;
  onToggleIsMessageSent?: () => void;
  isRtl: boolean;
}

const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const {
    containerClassName,
    pickerContainerClassName,
    onEmojiSelect,
    isMessageSent,
    onToggleIsMessageSent,
    isRtl,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { isOutside, setOutsideValue } = useOutsideClick(wrapperRef);

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
      className={classNames(styles.container, containerClassName, {
        [styles.containerRtl]: isRtl,
      })}
    >
      <ButtonIcon onClick={handleOpenPicker}>
        <EmojiIcon />
      </ButtonIcon>

      {isOpen && (
        <div
          className={classNames(
            pickerContainerClassName || styles.pickerContainer,
            {
              [styles.pickerContainerRtl]: isRtl,
            },
          )}
        >
          <Picker data={data} onEmojiSelect={onEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
