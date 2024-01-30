import React, {
  ChangeEventHandler,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import classNames from "classnames";
import { Close2Icon, SearchIcon } from "@/shared/icons";
import { ButtonIcon } from "../ButtonIcon";
import styles from "./SearchInput.module.scss";

export interface SearchInputRef {
  blur: () => void;
}

interface SearchInputProps {
  value: string;
  className?: string;
  autoFocus?: boolean;
  placeholder?: string;
  isSearchIconVisible?: boolean;
  onChange: (text: string) => void;
  onClose?: () => void;
}

const DEFAULT_PLACEHOLDER = "Search";

const SearchInput: ForwardRefRenderFunction<
  SearchInputRef,
  SearchInputProps
> = (props, ref) => {
  const {
    className,
    value,
    autoFocus,
    isSearchIconVisible = true,
    placeholder = DEFAULT_PLACEHOLDER,
    onChange,
    onClose,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const isCloseIconVisible = Boolean(onClose);

  useImperativeHandle(
    ref,
    () => ({
      blur: () => {
        inputRef.current?.blur();
      },
    }),
    [],
  );

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.inputWrapper}>
        {isSearchIconVisible && <SearchIcon className={styles.searchIcon} />}
        <input
          className={classNames(styles.input, {
            [styles.inputPaddingLeft]: isSearchIconVisible,
            [styles.inputPaddingRight]: isCloseIconVisible,
          })}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          ref={inputRef}
        />
        {isCloseIconVisible && (
          <ButtonIcon className={styles.closeIconButton} onClick={onClose}>
            <Close2Icon />
          </ButtonIcon>
        )}
      </div>
    </div>
  );
};

export default forwardRef(SearchInput);
