import { ThemeColors } from "@/shared/constants";

export const selectorStyles = (
  getThemeColor: (color: ThemeColors) => string,
) => {
  return {
    container: (provided) => ({ ...provided, width: "100%" }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10000,
      boxShadow: "none",
      marginTop: 0,
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: getThemeColor(ThemeColors.tertiaryFill),
    }),
    control: (provided) => ({
      ...provided,
      height: "3rem",
      width: "100%",
      backgroundColor: getThemeColor(ThemeColors.secondaryBackground),
      color: getThemeColor(ThemeColors.primaryText),
      borderColor: "rgba(255, 255, 255, 0)",
      boxShadow: "rgba(255, 255, 255, 0)",
      "&:hover": {
        boxShadow: "rgba(255, 255, 255, 0)",
      },
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
    indicatorsContainer: (provided) => ({
      ...provided,
      color: getThemeColor(ThemeColors.primaryText),
    }),
    singleValue: (provided) => ({
      ...provided,
      backgroundColor: getThemeColor(ThemeColors.secondaryBackground),
      color: getThemeColor(ThemeColors.primaryText),
    }),
  };
};
