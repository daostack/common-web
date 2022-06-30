import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import {
  Dropdown,
  DropdownOption,
  DropdownProps,
  DropdownRef,
} from "../Dropdown";
import { Input } from "../Form/Input";
import "./index.scss";

export interface AutocompleteOption extends Omit<DropdownOption, "searchText"> {
  searchText: string;
}

interface AutocompleteProps extends Omit<DropdownProps, "options"> {
  options: AutocompleteOption[];
}

const Autocomplete: FC<AutocompleteProps> = (props) => {
  const { placeholder, ...restProps } = props;
  const dropdownRef = useRef<DropdownRef>(null);
  const inputClickedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const inputName = useMemo(() => uuidv4(), []);
  const options = useMemo(() => {
    if (!filterValue) {
      return restProps.options;
    }

    const lowerCasedFilterValue = filterValue.toLowerCase();

    return restProps.options.filter((option) =>
      option.searchText.toLowerCase().includes(lowerCasedFilterValue)
    );
  }, [restProps.options, filterValue]);

  const handleOpen = () => {
    setIsOpen(true);
    dropdownRef.current?.openDropdown(false);
  };

  const handleInputClick = () => {
    inputClickedRef.current = true;
    handleOpen();
  };

  const handleInputFocus = () => {
    setTimeout(() => {
      handleOpen();
    }, 0);
  };

  const handleClose = useCallback(() => {
    const shouldSkipClosing = inputClickedRef.current;
    inputClickedRef.current = false;

    if (shouldSkipClosing) {
      return;
    }

    const option = options.find(({ value }) => value === restProps.value);
    setFilterValue(option?.searchText || "");
    setIsOpen(false);
    dropdownRef.current?.closeDropdown();
  }, [dropdownRef, inputClickedRef, restProps.value, options]);

  useEffect(() => {
    document.body.addEventListener("click", handleClose);

    return () => {
      document.body.removeEventListener("click", handleClose);
    };
  }, [handleClose]);

  useEffect(() => {
    const option = options.find(({ value }) => value === restProps.value);

    if (option) {
      setFilterValue(option.searchText);
    }
  }, [restProps.value]);

  const input = (
    <div className="custom-auto-complete__input-wrapper">
      <Input
        name={inputName}
        value={filterValue}
        placeholder={placeholder}
        onChange={(event) => setFilterValue(event.target.value)}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        styles={{
          input: {
            default: "custom-auto-complete__input",
          },
        }}
      />
      <RightArrowIcon
        className={classNames("custom-auto-complete__arrow-icon", {
          "custom-auto-complete__arrow-icon--opened": isOpen,
        })}
      />
    </div>
  );

  return (
    <Dropdown
      {...restProps}
      ref={dropdownRef}
      options={options}
      menuButton={input}
      fullMenuButtonChange
    />
  );
};

export default Autocomplete;
