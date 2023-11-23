import { Colors } from "@/shared/constants";

export const selectorStyles = (hasError: boolean, isDarkMode: boolean) => ({
  menu: (provided) => ({ ...provided, zIndex: 10000 }),
  menuPortal: (provided) => ({ ...provided, zIndex: 10000 }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#131b23" : "#ffffff",
  }),
  control: (provided) => ({
    ...provided,
    height: "3rem",
    ...(hasError && { borderColor: Colors.error }),
    backgroundColor: isDarkMode ? "#2e3452" : "#f8f8f5",
    color: isDarkMode ? "#ffffff" : "#001a36",
    borderColor: "rgba(255, 255, 255, 0)",
    boxShadow: "rgba(255, 255, 255, 0)",
    "&:hover": {
      boxShadow: "rgba(255, 255, 255, 0)",
    },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  indicatorsContainer: (provided) => ({
    ...provided,
    color: isDarkMode ? "#ffffff" : "#001a36",
  }),
  option: (provided, data) => ({
    ...provided,
    backgroundColor: data.isDisabled
      ? "transparent"
      : isDarkMode
      ? "#131b23"
      : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#001a36",
    "&:hover": {
      backgroundColor: data.isDisabled
        ? ""
        : isDarkMode
        ? "#2e3452"
        : "#fff9fd",
    },
    cursor: data.isDisabled ? "not-allowed" : "default",
  }),
  singleValue: (provided) => ({
    ...provided,
    backgroundColor: isDarkMode ? "#2e3452" : "#f8f8f5",
    color: isDarkMode ? "#ffffff" : "#001a36",
  }),
});
