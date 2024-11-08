import { ThemeColors } from "@/shared/constants";

export const selectorStyles = (
  hasError: boolean,
  getThemeColor: (color: ThemeColors) => string,
) => {
  return {
    menu: (provided) => ({ ...provided, zIndex: 10000 }),
    menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: getThemeColor(ThemeColors.tertiaryFill),
    }),
    control: (provided) => ({
      ...provided,
      height: "3rem",
      ...(hasError && { borderColor: getThemeColor(ThemeColors.warning) }),
      backgroundColor: getThemeColor(ThemeColors.secondaryBackground),
      color: getThemeColor(ThemeColors.primaryText),
      borderColor: "rgba(255, 255, 255, 0)",
      boxShadow: "rgba(255, 255, 255, 0)",
      "&:hover": {
        boxShadow: "rgba(255, 255, 255, 0)",
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    indicatorsContainer: (provided) => ({
      ...provided,
      color: getThemeColor(ThemeColors.primaryText),
    }),
    option: (provided, data) => ({
      ...provided,
      backgroundColor: data.isDisabled
        ? "transparent"
        : getThemeColor(ThemeColors.tertiaryFill),
      color: getThemeColor(ThemeColors.primaryText),
      "&:hover": {
        backgroundColor: data.isDisabled
          ? ""
          : getThemeColor(ThemeColors.secondaryBackground),
      },
      cursor: data.isDisabled ? "not-allowed" : "default",
    }),
    singleValue: (provided) => ({
      ...provided,
      backgroundColor: getThemeColor(ThemeColors.secondaryBackground),
      color: getThemeColor(ThemeColors.primaryText),
    }),
  };
};
