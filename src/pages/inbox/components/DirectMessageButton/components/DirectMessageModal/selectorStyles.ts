import { ThemeColors } from "@/shared/constants";

export const selectorStyles = (
  getThemeColor: (color: ThemeColors) => string,
  isTabletView: boolean,
) => {
  return {
    container: (provided) => ({ ...provided, width: "100%" }),
    menu: (provided) => ({
      ...provided,
      boxShadow: "none",
      marginTop: 0,
      backgroundColor: "transparent",
      position: "relative",
    }),
    menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: isTabletView ? "calc(100vh - 15rem)" : "15rem", // TODO: temporary - need to handle the height better.
    }),
    input: (provided) => ({
      ...provided,
      color: getThemeColor(ThemeColors.primaryText),
    }),
    control: (provided) => ({
      ...provided,
      minHeight: "3rem",
      width: "100%",
      backgroundColor: getThemeColor(ThemeColors.secondaryBackground),
      color: getThemeColor(ThemeColors.primaryText),
      borderColor: "rgba(255, 255, 255, 0)",
      boxShadow: "rgba(255, 255, 255, 0)",
      "&:hover": {
        boxShadow: "rgba(255, 255, 255, 0)",
      },
      cursor: "text",
    }),
    option: (provided, data) => ({
      ...provided,
      color: getThemeColor(ThemeColors.primaryText),
      backgroundColor: ThemeColors.primaryBackground,
      "&:hover": {
        backgroundColor: getThemeColor(ThemeColors.secondaryBackground),
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
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: getThemeColor(ThemeColors.quinaryFill),
    }),
    multiValueGeneric: (provided) => ({
      ...provided,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: getThemeColor(ThemeColors.hoverFill),
      },
    }),
  };
};
