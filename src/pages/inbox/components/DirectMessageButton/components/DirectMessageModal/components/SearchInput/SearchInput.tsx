import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import { SearchIcon } from "@/shared/icons";
import styles from "./SearchInput.module.scss";

interface SearchInputProps {
  className?: string;
  value: string;
  onChange: (text: string) => void;
  autoFocus?: boolean;
  multiple?: boolean;
}

const SearchInput: FC<SearchInputProps> = (props) => {
  const { className, value, onChange, autoFocus, multiple } = props;

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
          placeholder="Search"
          autoFocus={autoFocus}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default SearchInput;
