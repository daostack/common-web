import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import { Close2Icon, SearchIcon } from "@/shared/icons";
import { ButtonIcon } from "../ButtonIcon";
import styles from "./SearchInput.module.scss";

interface SearchInputProps {
  value: string;
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
  onChange: (text: string) => void;
  onClose?: () => void;
}

const DEFAULT_PLACEHOLDER = "Search";

const SearchInput: FC<SearchInputProps> = (props) => {
  const {
    className,
    value,
    autoFocus,
    placeholder = DEFAULT_PLACEHOLDER,
    onChange,
    onClose,
  } = props;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.inputWrapper}>
        <SearchIcon className={styles.searchIcon} />
        <input
          className={styles.input}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        {onClose && (
          <ButtonIcon className={styles.closeIconButton} onClick={onClose}>
            <Close2Icon />
          </ButtonIcon>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
