import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownOption } from "@/shared/components";
import { Language } from "@/shared/constants";
import { changeLanguage } from "@/shared/store/actions";
import { selectLanguage } from "@/shared/store/selectors";
import i18n from "@/i18n";
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
  const dispatch = useDispatch();
  const language = useSelector(selectLanguage());

  const handleLanguageChange = async (value: unknown) => {
    const language = value as Language;
    await i18n.changeLanguage(language);
    dispatch(changeLanguage(language));
  };

  return (
    <Dropdown
      value={language}
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
