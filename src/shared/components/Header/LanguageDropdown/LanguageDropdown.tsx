import React, { FC } from "react";
import { Dropdown, DropdownOption } from "@/shared/components";
import { Language } from "@/shared/constants";
import { useLanguage } from "@/shared/hooks";
import "./index.scss";

interface LanguageDropdownProps {
  className?: string;
}

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

const LanguageDropdown: FC<LanguageDropdownProps> = (props) => {
  const { className } = props;
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = async (value: unknown) => {
    await changeLanguage(value as Language);
  };

  return (
    <Dropdown
      className={className}
      value={language}
      onSelect={handleLanguageChange}
      options={LANGUAGES}
      shouldBeFixed={false}
      styles={{
        menuButton: "language-dropdown__menu-button",
        menuItem: "language-dropdown__menu-item",
        value: "language-dropdown__value",
      }}
    />
  );
};

export default LanguageDropdown;
