import React, { FC } from "react";
import { Dropdown, DropdownOption } from "@/shared/components";
import { Language } from "@/shared/constants";
import "./index.scss";

const LANGUAGES: DropdownOption[] = [
  {
    text: "Eng",
    searchText: "Eng",
    value: Language.English,
  },
  {
    text: "עברית",
    searchText: "עברית",
    value: Language.Hebrew,
    className: "language-dropdown__item--rtl",
  },
];

const LanguageDropdown: FC = () => {
  const handleLanguageChange = (value: unknown) => {
    console.log(value);
  };

  return (
    <Dropdown
      value={Language.English}
      onSelect={handleLanguageChange}
      options={LANGUAGES}
      shouldBeFixed={false}
      styles={{
        menuButton: "language-dropdown__menu-button",
      }}
    />
  );
};

export default LanguageDropdown;
